const Base = require("../../base/Command.js");

module.exports = class Truck extends Base {
    constructor(client) {
        super(client, {
            name: "truck",
            description: "Sends out an ASCII truck.",
            usage: "",
            category: "fun",
            permLevel: 0 
        });
    }

    run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        // Error if message does not end in ?

        const responses = [
        "
            ____________________
           |\                   \      l____
           | \___________________\     |\   \
           | |                    |    |\l___\___
      [__]_[ |                    |[\\]| |__|_\__\
     /\[__]\ |                    |\[\\]\|. | |===\
     \ \[__]\[____________________] \[__]|__|..___]
      \/.-.\_______________________\/.-.\____\/.-.\
       ( @ )                        ( @ )  =  ( @ )"
        ];

        // Send a response
        message.channel.send(`**__${message.member.displayName}__ asks: __${args.join(" ")}__**\n${responses[Math.floor(Math.random() * responses.length)]}`);
    }
};
