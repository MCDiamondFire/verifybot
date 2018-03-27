const Base = require("../../base/Command.js");

module.exports = class Pick extends Base {
    constructor(client) {
        super(client, {
            name: "contribute",
            description: "Gives information on contributing.",
            usage: "!pick",
            category: "information",
            permLevel: 0 
        });
    }

    run(message) {
             message.channel.send("Hi! Thanks for contributing! If you'd like to know more about contributing, visit the VerifyBot official GitHub repository at https://github.com/RedstoneDaedalus/verifybot/ ! Contribution guidelines, code of conduct, and pull request template are all on there. If you'd like to learn about pull requests, visit https://yangsu.github.io/pull-request-tutorial/ . Thanks for contributing! :confetti_ball:");
};
