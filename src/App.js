import TwitchCom from "./TwitchCom.js";
import ActionManager from "./ActionManager.js";
import TriggerManager from "./TriggerManager.js";

class App {
    constructor(config) {
        this.twitchCom = new TwitchCom(config, this);

        this.actionManager = new ActionManager(this);
        this.triggerManager = new TriggerManager(this.actionManager, config);

        this.readyFlag = 0;
    }

    connect() {
        this.twitchCom.connect();
        this.actionManager.connect();
    }

    addReadyFlag(mask) {
        this.readyFlag = this.readyFlag | mask;

        if (this.readyFlag == (1 | 2 | 4 | 8)) {
            console.log("All systems are up and running. Ready to stream!");
        }
        else if (this.readyFlag == (1 | 2 | 4)) {
            console.log("All systems are up and running. Waiting for OpenRCT2 plugin to connect...");
        }
    }

    removeReadyFlag(mask) {
        this.readyFlag = this.readyFlag & ~mask;

        if (this.readyFlag != 1 | 2 | 4 | 8) {
            console.warn("One or more systems failed. Please standby");
        }
    }
}

export default App;
