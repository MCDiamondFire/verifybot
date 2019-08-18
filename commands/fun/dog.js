const { get } = require("snekfetch");
const { MessageEmbed } = require("discord.js");
const Base = require("../../base/Command.js");

module.exports = class Dog extends Base {
    constructor(client) {
        super(client, {
            name: "dog",
            description: "Shows a random dog.",
            usage: "",
            category: "fun",
            permLevel: 0,
            cooldown: 60000
        });
    }

    async run(message) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");

        // Send a cat
        message.channel.send({ embed: {
            title: "Dog",
            color: 0xFF6464,
            image: { url: this.cache.shift() },
            footer: { text: "Use !upload <attached file or URL> to submit a dog image." }
        } });
        // Refile Cache
        this.fillCache(1);
    }

    async fillCache(amount = 5) {
        for (let i = 0; i < amount; i++) {
            const { text } = await get("https://verifybot.tomoli.cf/dog.php");
            this.cache.push(`${text}`);
        }
    }

    init() {
        Object.defineProperty(this, "cache", { value: [] });
        this.fillCache();
    }
};
