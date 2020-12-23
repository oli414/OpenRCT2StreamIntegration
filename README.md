# OpenRCT2 Stream Integration Relay
Project aiming to add the OpenRCT2 Twitch stream integration back in using a plugin.
OpenRCT2 plugins cannot communicate with Twitch directly, this project is the relay that will communicate with Twitch, and the OpenRCT2 plugin. Get the [OpenRCT2 Stream Integration Plugin](https://github.com/oli414/StreamIntegrationPlugin) here.

## Prerequisites
- Install [Node.js](https://nodejs.org/en/) (Recommended version)

## Installation
- [Download this project](https://github.com/oli414/OpenRCT2StreamIntegration/archive/master.zip) and unzip it where you like
- Run `install.bat` (On Windows), or: Navigate a command prompt to the project folder and run `npm install`
- (optional) Open `Config.json` with a text/code editor to customize how viewers can interact with your game. Visit [the wiki](https://github.com/oli414/OpenRCT2StreamIntegration/wiki) for more information

- Install the OpenRCT2 Stream Integration Plugin ([installation steps here](https://github.com/oli414/StreamIntegrationPlugin))

## Warning
The OpenRCT2 Stream Integration plugin is known to have a performance impact on your game. Use the checkbox in the in-game Stream Integration widget to disable the plugin when not in use.

## Running the OpenRCT2 Stream Integration for Twitch
- Run `start commands stream.bat` from the Relay's installation folder (On Windows), or: Navigate a command prompt to the project folder and run `npm run start`
- Your default browser may open asking you to log into Twitch, and give permission for the OpenRCT2 Stream Integration to keep track of channel activities
- Wait for the command prompt to show "All systems are up and running"
- Run OpenRCT2 and load a park
- Open the Twitch Stream Integration window under the map icon and verify that the status is "Connected"
