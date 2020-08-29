const fs = require("fs");

const App = require("./App");

const appConfig = {
    appClientID: "xijp8ir7bscb5n7sfsuinlzw6c0k86",
    secret: "bki9brsgpdx2e87zuxlnsrfy2scxxd",
    redirectUri: "http://localhost",
    pubSubHost: "wss://pubsub-edge.twitch.tv"
}

function loadConfig(file) {
    if (!fs.existsSync(file)) {
        throw new Error("Failed to locate \"" + file + "\". Please make sure that the config file is present.");
    }
    const str = fs.readFileSync(file);
    return JSON.parse(str);
}

const config = loadConfig("config.json");
config.appConfig = appConfig;

let app = new App(config);

app.connect();