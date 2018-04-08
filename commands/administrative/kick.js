const Base = require("../../base/ModCommand.js");

module.exports = class Kick extends Base {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Kicks the mentioned user.",
            usage: "<user> [-s] <reason>",
            category: "administrative",
            permLevel: 4
        });
    }

    async run(message) {
        // Build the moderation data
        const data = await super.build({
            message,
            name: "kick",
            color: 0xFF6400
        });

        try {
            // Post the moderation log
            super.post(data);
            // Kick the target user
            data.target.kick({ reason: `(${message.member.displayName}) ${data.reason}` });
        } catch (e) {
            return super.error("An error occured while attempting to kick this user.");
        }
    }
};
