const { Structures, escapeMarkdown } = require("discord.js");
const hasSwears = require("../methods/checkSwears");
const Command = require("../base/Command");

Structures.extend("Message", Structure => {
    class Message extends Structure {
        /**
         * Appends the message to a command
         * @param {Command} command The command to append the message to
         */
        appendTo(command) {
            if (!(command instanceof Command)) return Promise.reject("Invalid command.");
            Object.defineProperty(command, "message", { value: this, writable: true });
        }

        /**
         * Verifies that the message is under 75% caps
         * @returns {?UserOffense} A user offense object
         */
        checkCaps() {
            // Verify that message was not sent through DM and that content is longer than 10 characters
            if (this.channel.type !== "text" || this.content.length < 10) return false;

            // Fetch uppercase letter count
            const uppercase = this.content.split("").filter(char => char.toLowerCase() !== char).length;
            // Fetch % of uppercase letters
            const percentage = Math.round((uppercase / this.content.length) * 100);

            // If message is over 75% caps, register an offense
            if (percentage >= 75) return this.author.registerOffense("warn", 0xFFFF00, `Caps | \`${percentage}%\` uppercase`);
            // Otherwise, return false
            return false;
        }

        /**
         * Verifies that the message is profanity free
         * @returns {?UserOffense} A user offense object
         */
        checkProfanity() {
            // Verify that message was not sent through DM
            if (this.channel.type !== "text") return false;

            // Filter message
            const profane = hasSwears(this.content);

            // If message is profane, register an offense
            if (profane) return this.author.registerOffense("warn", 0xFFFF00, `Profanity | \`${escapeMarkdown(this.content)}\``);
            // Otherwise, return false
            return false;
        }

        /**
         * Verifies that a user has mentioned under 5 people in a minute
         * @returns {?UserOffense} A user offense object
         */
        checkMentionSpam() {
            // Verify that this message was not sent through DM and that there are valid user mentions
            if (this.channel.type !== "text" || this.mentions.members.size < 1) return false;

            // Register new user mentions
            this.author.registerMentions(this.mentions.members.size);

            // If author's mentions this minute are above 5, register an offense
            if (this.author.mentionsThisMinute >= 5) {
                this.member.kick("Spamming mentions.");
                return this.author.registerOffense("kick", 0xFF6400, `Mess mention | Mentioned \`${this.author.mentionsThisMinute}\` users in under a minute`);
            }
            // Otherwise, return false
            return false;
        }
    }

    return Message;
});
