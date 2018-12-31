const Base = require("../../base/Command.js");

module.exports = class EightBall extends Base {
    constructor(client) {
        super(client, {
            name: "8ball",
            description: "Ask the magic 8ball a question.",
            usage: "<question>",
            category: "fun",
            permLevel: 0 
        });
    }

    run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        // Error if message does not end in ?
        if (message.content.indexOf("?") !== message.content.length - 1) return super.error("That doesn't look like a question to me!");
        //Responses
        const responses = [
            "Definitely.",
            "Most likely.",
            "Cannot predict now.",
            "You may rely on it.",
            "Maybe, maybe not.",
            "It's a no from me.",
            "Absolutely not!",
            "Eeh, no."
        ];

        
        if(!message.content.includes("@")) { //Checks if it pings someone.
            message.channel.send(`**__${message.member.displayName}__ asks: __${args.join(" ")}__**\n${responses[Math.floor(Math.random() * responses.length)]}`);
            // Send a response
        }else{
            message.channel.send('You cant ping someone using the 8ball command!').then(msg => {
            msg.delete(5000)
          })
        }    
        
    }
};
