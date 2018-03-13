const Base = require("../../base/Command.js");

module.exports = class Ping extends Base {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Check if the bot is online (if it returns pong)",
            usage: "",
            category: "information",
            permLevel: 0,
            aliases: ["pong"]
        });
    }

    run() {
        super.respond(`pong`);
    }
};
