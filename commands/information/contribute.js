const Base = require("../../base/Command.js");

module.exports = class Credits extends Base {
    constructor(client) {
        super(client, {
            name: "contribute",
            description: "Shows how to contribute.",
            usage: "",
            category: "information",
            permLevel: 0
        });
    }

    run(message) {
        // Create a new embed
        message.channel.buildEmbed(this.client.config.embedTemplate)
            .setThumbnail(this.client.user.avatarURL({ size: 128 }))
            .setAuthor("Contributing")
            .setDescription("You can contribute to VerifyBot by clicking the link below:")
            .addField("» (268071134057070592)", "https://github.com/RedstoneDaedalus/verifybot/")
            .addField("» (180506843796209664)", "Please read the community guidelines and code of conduct in the master branch.")
            .send();
    }
};
