const config = require("../config.json");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(oldMessage, newMessage) {
        // If message was not sent the guild, return
        if (!newMessage.guild || newMessage.guild.id !== config.guild) return;
        // Fetch logs channel
        const logs = this.client.channels.find("name", config.channels.messageUpdates);
        // If no logs channel found, return false
        if (!logs) return false;

        // Create an empty var storing the action
        let action = null;
        // Find action type
        if (oldMessage.content !== newMessage.content) action = { action: "Message Edited", color: [255, 255, 100] };
        if (!oldMessage.pinned && newMessage.pinned) action = { action: "Message Pinned", color: [100, 255, 100] };
        if (oldMessage.pinned && !newMessage.pinned) action = { action: "Message Unpinned", color: [255, 155, 100] };

        // If no action found, ignore it
        if (!action) return;

        if (newMessage.author.bot && action.action === "Message Edited") return;

        // If message was sent in a channel that mods can't view, ignore it
        if (!newMessage.guild.roles.find("name", "Moderator").permissionsIn(newMessage.channel).has("VIEW_CHANNEL")) return;

        // Calculate permissions
        const userPerms = await this.client.permLevel(newMessage.author.id);

        // If user is not admin and action is edit...
        if (userPerms.level < 5 && action.action === "Message Edited") {
            // Check if automod was triggered
            const triggered = newMessage.checkCaps() || newMessage.checkProfanity() || newMessage.checkMentionSpam();
            // Wait for checks to be processed
            await triggered;

            if (triggered) return newMessage.delete();
        }

        // Create an embed
        const embed = logs.buildEmbed()
            .setColor(action.color)
            .setAuthor(`${newMessage.member.displayName} (${newMessage.author.tag})`)
            .setTitle(`${action.action} in #${newMessage.channel.name}.`)
            .setTimestamp();

        // Customise embed depending on action
        if (action.action === "Message Edited") {
            embed.addField("Old Content", oldMessage.content);
            embed.addField("New Content", newMessage.content);
        } else embed.setDescription(newMessage.content);

        // Send the embed
        embed.send();
    }
};
