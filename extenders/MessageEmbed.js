const { MessageEmbed } = require("discord.js");

MessageEmbed.prototype.send = function (options) {
    return this.channel.send({ embed: this, ...options });
};
