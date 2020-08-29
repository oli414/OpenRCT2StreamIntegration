const TwitchCom = require("./TwitchCom");
const ActionManager = require("./ActionManager");

class App {
    constructor(config) {
        this.twitchCom = new TwitchCom(config, this);

        this.actionManager = new ActionManager();
    }

    connect() {
        this.twitchCom.connect();
    }
}

module.exports = App;