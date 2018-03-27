const Base = require("../../base/Command.js");

module.exports = class Random extends Base {
    constructor(client) {
        super(client, {
            name: "random",
            description: "Generates a random number.",
            usage: "",
            category: "fun",
            permLevel: 0 
        });
    }

    async run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        
        const rnd = Math.random()
          Math.floor()
    }

    pause() {
        return new rnd(r => setTimeout(r, 5000));
    }
};
