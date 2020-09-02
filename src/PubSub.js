const WebSocketClient = require("websocket").client;
const fs = require("fs");

class PubSub {
    constructor(config, auth_token, channelID, twitchCom) {
        this.twitchCom = twitchCom;
        const that = this;
        this.client = new WebSocketClient();

        this.channelID = channelID;

        this.lastPing = new Date().getTime();
        this.lastResponse = new Date().getTime();

        this.client.on("connectFailed", (error) => {
            console.error("Error in PubSub WebSocket: " + error);
        });

        this.client.on("connect", (connection) => {
            console.log("Connected to PubSub");
            that.twitchCom.app.addReadyFlag(4);

            connection.on('error', function (error) {
                console.error("Error in PubSub WebSocket: " + error);
            });
            connection.on('close', function () {
                console.warn("PubSub WebSocket closed. Attempting reconnect in 10 seconds");
                that.twitchCom.app.removeReadyFlag(4);

                setTimeout(() => {
                    that.connect();
                }, 10000);
            });
            connection.on('message', function (message) {
                //console.log("PubSub message received:");
                //console.log(JSON.parse(message.utf8Data));

                const resData = JSON.parse(message.utf8Data);

                that.lastResponse = new Date().getTime();
                if (resData.type == "PONG") {
                    that.pingKeepAlive(connection);
                }
                else if (resData.type == "RECONNECT") {
                    console.warn("Twitch PubSub server is shutting down...");
                }
                else if (resData.type == "MESSAGE") {
                    let topic = resData.data.topic;
                    let topicData = JSON.parse(resData.data.message);

                    fs.appendFile('log.txt', topic + "\n" + JSON.stringify(topicData) + "\n", function (err) {

                    });

                    /*
                    topic = "channel-points-channel-v1." + that.channelID;
                    topicData = {
                        "type": "reward-redeemed",
                        "data": {
                            "timestamp": "2020-08-29T17:37:55.64004148Z",
                            "redemption": {
                                "id": "2164eab1-8a4b-4eb7-9cf3-481a8fe39c10",
                                "user": {
                                    "id": "50702969",
                                    "login": "oli414_",
                                    "display_name": "Oli414_"
                                },
                                "channel_id": "43159180",
                                "redeemed_at": "2020-08-29T17:37:55.64004148Z",
                                "reward": {
                                    "id": "81c2fdf9-5eac-4be1-87ba-06b57dd3bc6e",
                                    "channel_id": "43159180",
                                    "title": "Test Reward",
                                    "prompt": "This is just a test for future features!",
                                    "cost": 20,
                                    "is_user_input_required": true,
                                    "is_sub_only": false,
                                    "image": null,
                                    "default_image": {
                                        "url_1x": "https://static-cdn.jtvnw.net/custom-reward-images/default-1.png",
                                        "url_2x": "https://static-cdn.jtvnw.net/custom-reward-images/default-2.png",
                                        "url_4x": "https://static-cdn.jtvnw.net/custom-reward-images/default-4.png"
                                    },
                                    "background_color": "#545CC0",
                                    "is_enabled": true,
                                    "is_paused": false,
                                    "is_in_stock": true,
                                    "max_per_stream": {
                                        "is_enabled": false,
                                        "max_per_stream": 0
                                    },
                                    "should_redemptions_skip_request_queue": true,
                                    "template_id": null,
                                    "updated_for_indicator_at": "2020-08-29T17:37:19.518551112Z",
                                    "max_per_user_per_stream": {
                                        "is_enabled": false,
                                        "max_per_user_per_stream": 0
                                    },
                                    "global_cooldown": {
                                        "is_enabled": false,
                                        "global_cooldown_seconds": 0
                                    },
                                    "redemptions_redeemed_current_stream": 0,
                                    "cooldown_expires_at": null
                                },
                                "user_input": "Hello World 123 test!",
                                "status": "FULFILLED"
                            }
                        }
                    */

                    /*
                    {
                        "benefit_end_month": 0,
                        "user_name": "oli414_",
                        "display_name": "Oli414_",
                        "channel_name": "andrelczyk",
                        "user_id": "50702969",
                        "channel_id": "43159180",
                        "time": "2020-08-29T18:14:03.725340209Z",
                        "sub_message": {
                            "message": "",
                            "emotes": null
                        },
                        "sub_plan": "Prime",
                        "sub_plan_name": "Channel Subscription (andrelczyk)",
                        "months": 0,
                        "cumulative_months": 1,
                        "context": "sub",
                        "is_gift": false,
                        "multi_month_duration": 0
                    }*/

                    if (topic == "channel-points-channel-v1." + that.channelID) {
                        let title = topicData.data.redemption.reward.title;
                        let user_input = topicData.data.redemption.user_input;
                        let username = topicData.data.redemption.user.display_name;

                        that.twitchCom.app.triggerManager.trigger("CHANNEL_POINTS_REWARD", {
                            rewardTitle: title,
                            message: user_input,
                            username: username,
                            subscriber: topicData.data.redemption.reward.is_sub_only
                        });
                    }
                    else if (topic == "channel-subscribe-events-v1." + this.channelID) {
                        let user_input = topicData.sub_message.message;

                        let username = topicData.display_name;
                        let giver = username;
                        if (topicData.is_gift) {
                            username = topicData.recipient_display_name;
                            if (giver == null) {
                                giver = "anonymous";
                            }
                        }

                        that.twitchCom.app.triggerManager.trigger("SUBSCRIPTION", {
                            giver: giver,
                            message: user_input,
                            username: username,
                            subscriber: true
                        });
                    }
                }
            });

            connection.sendUTF(JSON.stringify({
                "type": "LISTEN",
                "nonce": "orct2-evt",
                "data": {
                    "topics": [
                        "channel-points-channel-v1." + this.channelID,
                        //"chat_moderator_actions." + this.channelID,
                        "channel-subscribe-events-v1." + this.channelID,
                    ],
                    "auth_token": auth_token
                }
            }));

            this.lastPing = new Date().getTime();
            this.lastResponse = new Date().getTime();

            this.pingKeepAlive(connection);
        });

        this.host = config.appConfig.pubSubHost;
    }

    pingKeepAlive(connection) {
        setTimeout(() => {
            this.lastPing = new Date().getTime();
            connection.sendUTF(JSON.stringify({
                type: "PING"
            }));
            setTimeout(() => {
                if (this.lastResponse < this.lastPing) {
                    console.warn("Twitch PubSub server failed to respond to PING. Reconnecting socket...");
                    connection.close();
                }
            }, 11000);
        }, 240000);
    }

    connect() {
        this.client.connect(this.host, "irc")
    }
}

module.exports = PubSub;