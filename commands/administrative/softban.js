const Base = require("../../base/ModCommand.js");

module.exports = class Softban extends Base {
    constructor(client) {
        super(client, {
            name: "softban",
            description: "Kicks the mentioned user as well as purging their messages.",
            usage: "<user> [-s] <reason>",
            category: "administrative",
            permLevel: 4
        });
    }

    async run(message) {
        // Build the moderation data
        const data = await super.build({
            message,
            name: "softban",
            color: 0xFF1600
        });

        try {
            // Post the moderation log
            super.post(data);
            // Kick the target user
            data.target.ban({ reason: `(softban | ${message.member.displayName}) ${data.reason}`, days: 7 }).then(() => data.target.unban({ reason: "Softban unban" }));
        } catch (e) {
            return super.error("An error occured while attempting to kick this user.");
        }
    }
};
