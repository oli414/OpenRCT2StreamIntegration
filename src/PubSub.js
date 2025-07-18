import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient} from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';

class PubSub {
    constructor(config, auth_token, channelID, twitchCom) {
        this.config = config;
        this.auth_token = auth_token;
        this.channelID = channelID;
        this.twitchCom = twitchCom;
        console.log("Connecting to EventSub");
    }

    async connect() {
        const authProvider = await new StaticAuthProvider(this.config.appConfig.appClientID, this.auth_token);
        const apiClient = new ApiClient({ authProvider });
        console.log(`Bot name: ${this.config.twitch.botName}`);
        const user = await apiClient.users.getUserByName(this.config.twitch.botName);
        this.userID = "";
        if (user) {
            this.userID = user.id;
            console.log(`User ID for ${this.config.twitch.botName}: ${user.id}`);
        } else {
            console.log(`User ${this.config.twitch.botName} not found.`);
        }


        const listener = new EventSubWsListener({ apiClient });
        listener.start();

        const subscribeEvent = listener.onChannelSubscription(this.userID, e=> {
            try {
                let user_input = e.message;

                let username = e.userDisplayName;
                let giver = username;
                if (e.isGift) {
                        giver = e.gifterDisplayName || "anonymous";
                }

                this.twitchCom.app.triggerManager.trigger("SUBSCRIPTION", {
                    giver: giver,
                    message: user_input,
                    username: username,
                    subscriber: true
                });
            } catch (error) {
                console.error("An error occurred:", error);
                console.error("Error name:", error.name);
                console.error("Error message:", error.message);
            }
        })

        const pointEvent = listener.onChannelRedemptionAdd(this.userID, e => {
            try {
                let title = e.rewardTitle;
                let user_input = e.input;
                let username = e.userDisplayName;

                this.twitchCom.app.triggerManager.trigger("CHANNEL_POINTS_REWARD", {
                    rewardTitle: title,
                    message: user_input,
                    username: username,
                    subscriber: false
                });
            } catch (error) {
                console.error("An error occurred:", error);
                console.error("Error name:", error.name);
                console.error("Error message:", error.message);
            }
        })
    }
}

export default PubSub;
