const Base = require("../../base/Command.js");

module.exports = class Credits extends Base {
    constructor(client) {
        super(client, {
            name: "credits",
            description: "Lists the bot's credits.",
            usage: "",
            category: "information",
            permLevel: 0
        });
    }

    run(message) {
        // Create a new embed
        message.channel.buildEmbed(this.client.config.embedTemplate)
            .setThumbnail(this.client.user.avatarURL({ size: 128 }))
            .setAuthor("Credits")
            .setDescription("This is a full list of users who helped with the development of VerifyBot, directly or indirectly.")
            .addField("» RedstoneDaedalus#2020 (268071134057070592)", "Bot developer")
            .addField("» Jeremaster#3655 (180506843796209664)", "Minecraft server developer")
            .addField("» York#0001 (146048938242211840)", "Source code for website")
            .addField("» derpy.#8302 (223518178100248576)", "Made commands like !idea and !cat as well as provided a swear filter")
            .addField("» Dragzii#0025 (278656939016192000)", "Community manager, created github related changes such as community guidelines, pull request template")
            .send();
    }
};
