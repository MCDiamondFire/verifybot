const { inspect } = require("util");
const levels = require("../levels.json");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        // Ignore if sender is bot, or if message is sent in a direct message
        if (message.author.bot || !message.guild || message.channel.type !== "text") return;

        // Calculate permissions
        const userPerms = await this.client.permLevel(message.author.id);

        // If user is not support...
        if (userPerms.level < 2) {
            // Check if automod was triggered
            const triggered = message.checkCaps() || message.checkProfanity() || message.checkMentionSpam();
            // Wait for checks to be processed
            await triggered;

            if (triggered) return message.delete();
        }
        
        // Verify that message is a command
        if (!message.content.startsWith(this.client.options.prefix)) return;

        if (userPerms.level < 4 && ["reports"].includes(message.channel.name)) return;

        // Fetch command name and arguments
        const args = message.content.split(/\s+/g);
        const command = args.shift().slice(this.client.config.prefix.length);
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if (!cmd) return;

        // Check if user is on cooldown
        if (cmd.cooldown.has(message.author.id)) return;

        // Delete message containing command if clean = true
        if (cmd.clean) message.delete();
        // Append the message to the command
        message.appendTo(cmd);

        // Throw error is permissions are too low
        if (userPerms.level < cmd.conf.level) return cmd.error(`Your permission level is too low to execute this command. You are permission level \`${userPerms.level}\` (**${userPerms.name}**) and this command required level \`${cmd.conf.level}\` (**${levels.perms.find(p => p.level === cmd.conf.level).name}**).`);

        // Run command
        cmd.run(message, args, userPerms);

        // Put the user on cooldown
        if (userPerms.level < 4) cmd.startCooldown(message.author.id);
    }
};
