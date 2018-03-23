const Base = require("../../base/Command.js");
module.exports = class YesNo extends Base {
    constructor(client) {
        super(client, {
            name: "yesno",
            description: "Ask a question and get a yes/no answer.",
            usage: "<question>",
            category: "fun",
            permLevel: 0 
        });
    }

    run(message, args) {
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        if (message.content.indexOf("?") !== message.content.length - 1) return super.error("That doesn't look like a question to me!");
      
        const responses = [
            "Yes.",
            "No.",
        ];

        message.channel.send(`**__${message.member.displayName}__ asks: __${args.join(" ")}__**\n${responses[Math.floor(Math.random() * responses.length)]}`);
    }
};
