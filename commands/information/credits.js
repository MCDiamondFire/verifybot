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
            .addField("» Daedalus#1111 (268071134057070592)", "Bot developer")
            .addField("» Jeremaster#3655 (180506843796209664)", "Minecraft server developer")
            .addField("» York#0001 (146048938242211840)", "Source code for website")
            .addField("» derpy.#8302 (223518178100248576)", "Made commands like !idea and !cat as well as provided a swear filter")
            .addField("» Dragzii#0025 (278656939016192000)", "Community manager, created github related changes such as community guidelines, pull request template")
            .addField("» ArtificialLegacy#0682 (261619158096150528)", "Created !nod")
            .addField("» Tomoli75#8318 (248855041803288576)", "Improved !cat with truly random cats")
            .addField("» SiebeDW#4501  (261885314933587969)", "Added embeds to commands, made !upload")
            .setFooter("All other contributors are mentioned at https://github.com/RedstoneDaedalus/verifybot/graphs/contributors")
            .send();
    }
};
