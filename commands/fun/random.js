const Base = require("../../base/Command.js");

module.exports = class Random extends Base {
    constructor(client) {
        super(client, {
            name: "random",
            description: "Generates a random number.",
            usage: "<min> <max>",
            category: "fun",
            permLevel: 0 
        });
    }

    async run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        
        // Parse arguments
        const one = parseInt(args[0]);
        const two = parseInt(args[1]);
        
        // Validate arguments
        if (isNaN(one) || isNaN(two)) return super.error("Please provide two valid numbers.");
        if (two > one) return super.error("The first number must be smaller than the second.");
        
        // Chose a number
        super.respond(`I chose \`${Math.floor(Math.random() * max) + min}\`.`);
    }
};
