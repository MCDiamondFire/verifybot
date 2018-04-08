const { Structures, MessageEmbed } = require("discord.js");

Structures.extend("TextChannel", Structure => {
    class TextChannel extends Structure {
        buildEmbed(data = {}) {
            return Object.defineProperty(new MessageEmbed(data), "channel", { value: this, writable: true });
        }
    }

    return TextChannel;
});

Structures.extend("DMChannel", Structure => {
    class DMChannel extends Structure {
        buildEmbed(data = {}) {
            return Object.defineProperty(new MessageEmbed(data), "channel", { value: this, writable: true });
        }
    }

    return DMChannel;
});
