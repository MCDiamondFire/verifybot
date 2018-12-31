const Base = require("../../base/Command.js");

module.exports = class Upload extends Base {
    constructor(client) {
        super(client, {
            name: "upload",
            description: "You can use https://verifybot.tomoli.cf/add.php to upload your own pictures.",
            usage: "",
            category: "fun",
            permLevel: 0,
            aliases: ["uploadmyanimal"]
        });
    }

    run() {
        super.respond(`You can use https://verifybot.tomoli.cf/add.php to upload your own pictures to VerifyBot.`);
    }
};
