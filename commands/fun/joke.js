const Base = require("../../base/Command.js");

module.exports = class iFunnyIsBad extends Base {
    constructor(client) {
        super(client, {
            name: "joke",
            description: "Makes a semi-funny joke.",
            usage: "",
            category: "fun",
            permLevel: 0 
        });
    }

    run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        const responses = [
        "What's a ghost's favorite cereal? Ghost toasties! :joy:",
        "XDDDDDD",
        "The Emoji Movie is the best animated film of the century.",
        "Snape kills Dumbledore",
        "So what's the deal with airline food?",
        "Two guys join a plot. The first says he's hungry. The second continues to eat him. #comedy",
        "360 N0SC0P3 R3KT M9",
        "Be sure to check out SiIvaGunner's high-quality video game rips.",
        "!ban @ everyone bow down to your robot overlords... oh wait",
        "ABCDEFG I'm a bot don't trust me",
        "Dubinzi banned I for big fat",
        "How much detotated wam should I have for my minecraft server, Jeremaster asked politely."
        ];

        // Send a response
        message.channel.send(`**__${message.member.displayName}__ asks: __${args.join(" ")}__**\n${responses[Math.floor(Math.random() * responses.length)]}`);
    }
};
