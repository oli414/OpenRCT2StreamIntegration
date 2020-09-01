const https = require('https');
const opn = require('opn');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PubSub = require("./PubSub");
const TwitchIRC = require("./TwitchIRC");

class TwitchCom {
    constructor(config, app) {
        this.app = app;
        this.appClientID = config.appConfig.appClientID;
        this.redirectUri = config.appConfig.redirectUri;

        this.channelID = "";
        this.channelName = "";

        this.storedAccessToken = "";
        if (fs.existsSync("access_token.bin")) {
            this.storedAccessToken = fs.readFileSync("access_token.bin").toString();
        }

        this.loginResolve = null;

        this.webServerPort = config.callbackPort;
        this.webServer = express();
        this.webServer.use(express.json());
        this.webServer.get('/', (req, res) => {
            res.sendFile(path.resolve("public/index.html"));
        })
        this.webServer.post('/access_token', (req, res) => {
            if (this.loginResolve) {
                this.setAccessToken(req.body.access_token);

                this.validate(this.storedAccessToken).then(() => {
                    this.loginResolve();
                });
            }
        })
        this.webServer.listen(this.webServerPort);

        this.config = config;
    }

    setAccessToken(token) {
        this.storedAccessToken = token;
        fs.writeFileSync("access_token.bin", this.storedAccessToken);
    }

    validate(token) {
        const that = this;
        return new Promise(resolve => {

            console.log("Validating token...");
            const options = {
                hostname: "id.twitch.tv",
                port: 443,
                path: "/oauth2/validate",
                method: "GET",
                headers: {
                    "Authorization": "OAuth " + token
                }
            };
            const req = https.request(options, res => {
                if (res.statusCode == 401) {
                    // Invalid token
                    that.storedAccessToken = "";
                    that.login().then(() => {
                        resolve();
                    });
                }
                else if (res.statusCode >= 200 && res.statusCode < 203) {
                    console.log("Twitch authentication token has been validated");
                    // All good to go
                    let str = "";
                    res.on('data', function (chunk) {
                        str += chunk;
                    });
                    res.on('end', function () {
                        let obj = JSON.parse(str);
                        that.channelID = obj.user_id;
                        that.channelName = obj.login;
                        resolve();
                    });
                }
                else {
                    throw new Error("Unexpected response from Twitch. Twitch responded with " + res.statusCode + " upon token validation.");
                }
            });

            req.on('error', (e) => {
                throw new Error(e);
            });
            req.end();
        });
    }

    login() {
        return new Promise(resolve => {
            this.loginResolve = resolve;
            let scope = [
                "bits:read",
                "channel:read:subscriptions",
                "channel:read:redemptions",
                "channel_subscriptions",
                "chat:read"//,
                //"channel:moderate"
            ]
            opn("https://id.twitch.tv/oauth2/authorize?client_id=" + encodeURI(this.appClientID) + "&redirect_uri=" + encodeURI(this.redirectUri + ":" + this.webServerPort) + "&response_type=token&scope=" + encodeURI(scope.join(' ')));
        });
    }

    authenticate() {
        return new Promise(resolve => {
            if (this.storedAccessToken != null && this.storedAccessToken != "") {
                this.validate(this.storedAccessToken).then(() => {
                    resolve();
                });
            }
            else {
                this.login().then(() => {
                    resolve();
                });
            }
        });
    }

    apiGetRequest(path) {
        const that = this;
        return new Promise(resolve => {
            const options = {
                hostname: "api.twitch.tv",
                port: 443,
                path: path,
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + that.storedAccessToken,
                    "Client-ID": this.appClientID
                }
            };
            const req = https.request(options, res => {
                if (res.statusCode == 401) {
                    // Invalid token
                    console.log("Failed to access API. Restart the Relay");

                    let str = "";
                    res.on('data', function (chunk) {
                        str += chunk;
                    });
                    res.on('end', function () {
                        let obj = JSON.parse(str);
                    });
                    /*
                    this.storedAccessToken = "";
                    this.login().then(() => {
                        resolve();
                    });*/
                }
                else if (res.statusCode >= 200 && res.statusCode < 203) {
                    // All good to go
                    let str = "";
                    res.on('data', function (chunk) {
                        str += chunk;
                    });
                    res.on('end', function () {
                        let obj = JSON.parse(str);
                        resolve(obj);
                    });
                }
                else {
                    throw new Error("Unexpected response from Twitch. Twitch responded with " + res.statusCode + " upon " + path + ".");
                }
            });

            req.on('error', (e) => {
                throw new Error(e);
            });
            req.end();
        });
    }

    tmiRequest(path) {
        // tmi.twitch.tv/group/user/andrelczyk/chatters
        const that = this;
        return new Promise(resolve => {
            const options = {
                hostname: "tmi.twitch.tv",
                port: 443,
                path: path,
                method: "GET"
            };
            const req = https.request(options, res => {
                if (res.statusCode == 401) {
                    // Invalid token
                    console.log("Failed to access API");

                    let str = "";
                    res.on('data', function (chunk) {
                        str += chunk;
                    });
                    res.on('end', function () {
                        let obj = JSON.parse(str);
                        console.log(obj);
                    });
                    /*
                    this.storedAccessToken = "";
                    this.login().then(() => {
                        resolve();
                    });*/
                }
                else if (res.statusCode >= 200 && res.statusCode < 203) {
                    // All good to go
                    let str = "";
                    res.on('data', function (chunk) {
                        str += chunk;
                    });
                    res.on('end', function () {
                        let obj = JSON.parse(str);
                        resolve(obj);
                    });
                }
                else {
                    throw new Error("Unexpected response from Twitch. Twitch responded with " + res.statusCode + " upon " + path + ".");
                }
            });

            req.on('error', (e) => {
                throw new Error(e);
            });
            req.end();
        });
    }

    connect() {
        this.authenticate().then(() => {
            console.log("Completed Twitch authentication");
            this.app.addReadyFlag(1);

            let pubSub = new PubSub(this.config, this.storedAccessToken, this.channelID, this);
            pubSub.connect();

            let ircCom = new TwitchIRC(this.config, this.storedAccessToken, this.channelName, this);
            ircCom.connect();

            /*
            this.apiGetRequest("/helix/kraken/channel").then((data) => {
                console.log("helix get channel");
                console.log(data);
            });*/

        }).catch(() => {
            console.error("Failed Twitch authentication");
        });
    }
}

module.exports = TwitchCom;