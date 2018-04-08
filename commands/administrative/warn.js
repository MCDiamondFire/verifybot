const Base = require("../../base/ModCommand.js");

module.exports = class Warn extends Base {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "Warns the mentioned user.",
            usage: "<user> [-s] <reason>",
            category: "administrative",
            permLevel: 4
        });
    }

    async run(message) {
        // Build the moderation data
        const data = await super.build({
            message,
            name: "warn",
            color: 0xFFFF00
        });

        try {
            // Post the moderation log
            super.post(data);
        } catch (e) {
            return super.error("An error occured while attempting to warn this user.");
        }
    }
};
