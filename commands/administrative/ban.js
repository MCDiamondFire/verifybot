const Base = require("../../base/ModCommand.js");

module.exports = class Ban extends Base {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Bans the mentioned user.",
            usage: "<user> [-s] <reason>",
            category: "administrative",
            permLevel: 4
        });
    }

    async run(message) {
        // Build the moderation data
        const data = await super.build({
            message,
            name: "ban",
            color: 0xFF0000
        });

        try {
            // Post the moderation log
            super.post(data);
            // Ban the target user
            data.target.ban({ reason: `(${message.member.displayName}) ${data.reason}` });
        } catch (e) {
            return super.error("An error occured while attempting to ban this user.");
        }
    }
};
