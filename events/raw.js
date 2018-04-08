module.exports = class  {
    constructor(client) {
        this.client = client;
    }

    async run({ d, t }) {
        if (t !== "MESSAGE_REACTION_ADD") return false;
        // Verify user
        const user = d.user || await this.client.users.get(d.user_id);
        if (!user) return false;

        // Verify channel
        const channel = d.channel || this.client.channels.get(d.channel_id);
        if (!channel || channel.type === "voice") return false;
        if (!d.emoji) return false;

        // Verify message
        const message = await channel.messages.fetch(d.message_id);
        if (!message) return false;

        // Verify reaction
        const reaction = message.reactions.add({
            emoji: d.emoji,
            count: 0,
            me: user.id === this.client.user.id
        });

        reaction._add(user);

        if (user.id === this.client.user.id) return;
        if (!message.content || !message.content.startsWith("**VerifyBot Help** for ")) return;

        const icons = new Map()
            .set("ℹ", "information")
            .set("⚙", "administrative")
            .set("❓", "support")
            .set("💻", "system")
            .set("🎉", "fun");

        // Get permission level
        const perms = await this.client.permLevel(user.id);
        // Get commands
        const commands = this.client.commands.filter(command => command.conf.level <= perms.level);
        // Get categores
        const categories = ["information", "administrative", "support", "system", "fun"];


        // Get the category
        const category = icons.get(d.emoji.name);
        if (!category) return;
        // Edit the mesasge
        await message.edit(`**VerifyBot Help** for ${d.emoji.name} __${category}__ commands\nUse the **reaction buttons** to navigate.\n\n${commands.filter(c => c.help.category === category).length == 0 ? "No commands available to you in this category." : commands.filter(c => c.help.category === category).map(c => `\`!${c.help.name} ${c.help.usage}\` ${c.help.description}`).join("\n")}`);
    }
};
