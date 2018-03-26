const Base = require("../../base/Command.js");

module.exports = class iFunnyIsBad extends Base {
    constructor(client) {
        super(client, {
            name: "pun",
            description: "funney scream",
            usage: "",
            category: "fun",
            permLevel: 0 
        });
    }

    run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        const responses = [
        "What's a ghost's favorite cereal? Ghost toasties!",
        ];

        // Send a response
        message.channel.send(`**__${message.member.displayName}__ asks: __${args.join(" ")}__**\n${responses[Math.floor(Math.random() * responses.length)]}`);
    }
};
