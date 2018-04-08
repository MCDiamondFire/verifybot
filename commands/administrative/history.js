const Base = require("../../base/Command.js");

module.exports = class Ban extends Base {
    constructor(client) {
        super(client, {
            name: "history",
            description: "Checks a user's Discord history.",
            usage: "<user>",
            category: "administration",
            permLevel: 4,
            aliases: ["hist"]
        });
    }

    async run(message, args) {
        const user = await super.verifyUser(args[0]);
        if (!user) return super.error("Invalid user.");
        
        const entries = await this.client.query(`SELECT * FROM discord_offenses WHERE user_id = '${user.id}';`);

        message.channel.buildEmbed()
            .setColor(0xFFFFFF)
            .setAuthor(user.tag, user.avatarURL({ size: 128, format: "png" }))
            .setTitle("Moderation History")
            .setDescription(entries.length === 0 ? "No moderation history." : entries.sort((a, b) => a.id - b.id).map(entry => {
                const date = `${["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][entry.time.getMonth()]} ${entry.time.getDate()}, ${entry.time.getFullYear()}`;
                return `Recieved **${entry.action}** on **${date}**${entry.reason ? ` for ${entry.reason}` : ""} (case ID ${entry.id})`;
            }))
            .setFooter("VerifyBot by RedstoneDaedalus")
            .send();
    }
};
