const Base = require("../../base/Command.js");

module.exports = class Meow extends Base {
    constructor(client) {
        super(client, {
            name: "idea",
            description: "Generates a plot idea.",
            usage: "",
            category: "fun",
            permLevel: 0,
            cooldown: 60000
        });

        Object.defineProperty(this, "gameType", {
            value: [
                "An escapists game",
                "A PvP game",
                "An RPG game",
                "A parkour game",
                "A puzzle game",
                "A clicker game",
                "A tycoon game",
                "A survival game",
                "A horror game",
                "A magic game",
                "A KitPvP game",
                "A trivia game",
                "A exploration game",
                "An adventure game",
                "A real time strategy game",
                "A grindy escapist",
                "A grindy survival",
                "A strategy game",
                "A board game",
                "A mob arena game",
                "A dropper game",
                "A spleef game"
            ]
        });
        
        Object.defineProperty(this, "gameObjective", {
            value: [
                "where you parkour",
                "where you escape",
                "where you run",
                "where you collect items",
                "where you shoot lasers",
                "where you mirror movement",
                "where you rebuild structures",
                "where you farm points",
                "where you kill players",
                "where you battle mobs",
                "where you grind gold",
                "where you create a farm",
                "where you build a fort",
                "where you destroy a fort",
                "where you report a player",
                "where you break plot rules",
                "where you die",
                "where you jump",
                "where you fly",
                "where you build",
                "where you swim",
                "where you can't sprint",
                "where you play minigames",
                "where you battle Jeremaster",
                "where you battle a mob",
                "where you write fanfictions",
                "where you break everything",
                "where you get demonetized",
                "where you kill animals",
                "where you kill mobs",
                "where you code",
                "where you drown",
                "where you eat cake",
                "where you trigger lagslayer",
                "where you avoid CPU ussage",
                "where you break the loop",
            ]
        });
        
        Object.defineProperty(this, "gameReward", {
            value: [
                "until you die.",
                "until time runs out.",
                "to get points.",
                "to get escapes.",
                "to win.",
                "to end the game.",
                "to fail.",
                "to kill everything.",
                "and have to beat all levels",
                "with friends.",
                "or you die.",
                "or Dubanzi bans you.",
                "or you get kicked.",
                "or you won't get invited to the party.",
                "or you won't get your breakfast.",
                "with NPC Friends",
                "with fake friends.",
                "with Ottelino. <3",
                "with Jeremaster.",
                "with SnorkelStudios.",
                "or you get banned.",
                "or a tornado takes you to the land of OZ.",
                "with noone else.",
                "and get killed.",
                "and disappear.",
                "and stuff.",
                "to get banned.",
                "to make LagSlayer kill the plot.",
                "to be hated.",
                "to lose points.",
                "to be a meme.",
                "to win free overlord."
            ]
        });

        Object.defineProperty(this, "type", { value: this.gameType[Math.floor(Math.random() * this.gameType.length)], writable: true });
        Object.defineProperty(this, "objective", { value: this.gameObjective[Math.floor(Math.random() * this.gameObjective.length)], writable: true });
        Object.defineProperty(this, "reward", { value: this.gameReward[Math.floor(Math.random() * this.gameReward.length)], writable: true });
    }

    run(message) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");

        // Send a response
        message.channel.send(`[**Game**] ${this.type} ${this.objective} ${this.reward} `);
        // NEW GAME
        
        Object.defineProperty(this, "type", { value: this.gameType[Math.floor(Math.random() * this.gameType.length)], writable: true });
        Object.defineProperty(this, "objective", { value: this.gameObjective[Math.floor(Math.random() * this.gameObjective.length)], writable: true });
        Object.defineProperty(this, "reward", { value: this.gameReward[Math.floor(Math.random() * this.gameReward.length)], writable: true });
    }
};
