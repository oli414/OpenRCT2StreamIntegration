

class TriggerManager {
    constructor(actionManager, config) {
        this.actionManager = actionManager;

        this.interactions = config.interactions;
    }

    trigger(type, params) {
        for (let i = 0; i < this.interactions.length; i++) {
            let interaction = this.interactions[i];

            let trigger = interaction.trigger;
            if (interaction.trigger.type == type) {
                if (type == "COMMAND") {
                    if (params.message.startsWith(interaction.trigger.command)) {
                        let strippedMessage = params.message.substring(interaction.trigger.command.length);
                        params.message = strippedMessage.trim();
                        this.actionManager.trigger(interaction.action, params);
                    }
                }
                else if (type == "CHANNEL_POINTS_REWARD") {
                    this.actionManager.trigger(interaction.action, params);
                }
                else if (type == "SUBSCRIPTION") {
                    if (trigger.useGiverName) {
                        params.username = params.giver;
                    }
                    if (params.message == "") {
                        params.message = params.username;
                    }
                    this.actionManager.trigger(interaction.action, params);
                }
                else if (type == "VIEWER_JOINS") {
                    this.actionManager.trigger(interaction.action, params);
                }
            }
        }
    }
}

module.exports = TriggerManager;