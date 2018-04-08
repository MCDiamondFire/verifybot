const { Structures } = require("discord.js");

Structures.extend("User", Structure => {
    class User extends Structure {
        constructor(...args) {
            super(...args);

            /**
             * The user's mentions in the last minute
             * @Type {Number}
             */
            Object.defineProperty(this, "mentionsThisMinute", { value: 0, writable: true });
        }

        /**
         * Registers a certain amount of mentions to a user
         * @param {Number} count The total number of mentions
         */
        registerMentions(count) {
            // Add count to mentionsThisMinute
            this.mentionsThisMinute += count;

            // Remove count mentionsThisMinute after 60 seconds
            setTimeout(() => (this.mentionsThisMinute -= count), 60000);
        }

        /**
         * Registers an offense for the user
         * @param {String} action The name of the offense
         * @param {String} color The color of the moderation log
         * @param {Sting} reason The reason for the action
         */
        async registerOffense(action, color, reason, moderator = this.client.user) {
            const [latest] = await this.client.query("SELECT id FROM discord_offenses ORDER BY id DESC LIMIT 1;");
            const id = latest ? latest.id + 1 : 1;

            const channel = this.client.channels.find("name", this.client.config.channels.modlog);
            if (!channel) return { action, color, reason, moderator };

            try {
                await this.client.query(`INSERT INTO discord_offenses (id, user_id, action, reason) VALUES ('${id}', '${this.id}', '${action}', '${reason.replace(/;--/ig, "")}')`);

                await channel.buildEmbed()
                    .setColor(color)
                    .setAuthor(`${moderator.tag} (${moderator.id})`)
                    .setDescription(`**User:** ${this.tag} (${this.id})\n**Punishment:** ${action}\n**Reason:** ${reason}`)
                    .setFooter(`Case ${id}`)
                    .setTimestamp()
                    .send();
            } catch (e) {
                return true;
            }

            return true;
        }
    }

    return User;
});
