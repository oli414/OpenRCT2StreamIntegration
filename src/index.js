import fs from "fs";

import App from "./App.js";
const appConfig = {
    appClientID: "xijp8ir7bscb5n7sfsuinlzw6c0k86",
    redirectUri: "http://localhost",
    pubSubHost: "wss://pubsub-edge.twitch.tv"
}

function loadConfig(file) {
    console.log("Loading config: " + file);
    if (!fs.existsSync(file)) {
        throw new Error("Failed to locate \"" + file + "\". Please make sure that the config file is present.");
    }
    const str = fs.readFileSync(file);
    return JSON.parse(str);
}

let configPath = "config.json";
if (process.argv) {
    if (process.argv[2]) {
        configPath = process.argv[2];
    }
}

const config = loadConfig(configPath);
config.appConfig = appConfig;

let app = new App(config);

app.connect();
