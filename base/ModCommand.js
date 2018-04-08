const Command = require("./Command.js");

/**
 * Represents a moderation command
 * @extends Command
 */
class ModCommand extends Command {
    /**
     * Used to fetch data for the command
     * @param {Object} data The data used for the command
     * @param {Discord.Message} data.message The message used to extract mentions and args
     * @param {String} data.name The name of the action
     * @param {Number} data.color The color for the moderation log
     * @returns {Promise<data>} An object used for post
     */
    async build({ message, name, color }) {
        // Match regular expression with message content
        const match = /(?:<@!?)?(\d{15,21})(?:>?)\s(-s|)\s{0,}(.+|)/.exec(message.content);
        // Verify that a match has been made
        if (!match || match.length !== 4) return super.error("Invalid command usage. Use `!help` to see commands and their usages.");

        const target = this.client.guild.members.get(match[1]);

        if (!target) return super.error("Invalid user.");
        if (message.guild.me.roles.highest.comparePositionTo(target.roles.highest) < 1) return super.error("Insufficient bot permissions.");
        if (match[3].length > 128) return super.error("Reason cannot be longer than 128 characters.");

        return { target, message, reason: match[3], name, color, silent: !!match[2].length };
    }

    /**
     * Posts a moderation log
     * @param {Object} data Data returned from the build function
     * @returns {Promise<>} An empty promise
     */
    async post({ target, message, reason, name, color, silent }) {
        // Fetch modlog
        const channel = message.guild.channels.find("name", this.client.config.channels.modlog);
        // Throw an error if there is no modlog present.
        if (!channel) return super.error(`Please create a channel named \`#${this.client.config.channels.modlog}\` to use moderation commands.`);

        // Register the offense
        target.user.registerOffense(name, color, reason, message.author);

        // If not silent, send the user a message
        if (!silent) target.send(`You have a new ${name} for the reason \`${reason}\`.`).catch(() => null);

        // Respond to the message
        super.respond(`Successfully executed ${name} on ${target.user.tag}.`);
    }
}

module.exports = ModCommand;
