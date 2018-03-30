const Base = require("../../base/Command.js");

module.exports = class Music extends Base {
    constructor(client) {
        super(client, {
            name: "music",
            description: "Plays a nice song.",
            usage: "",
            category: "information",
            permLevel: 0 
        });
    }

    run(message, args, perms) {
        super.respond(
        ╔══╗ ♫

        ║██║ ♪♪

        ║██║♫♪

        ║ ◎♫♪♫

        ╚══╝ Turn Up The Music!!!



        Music♩♪♫♬ Volume: ▁ ▂ ▃ ▄ ▅ ▆ █ 100 %


        );
    }
};
