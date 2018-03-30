const Base = require("../../base/Command.js");

module.exports = class Stop extends Base {
    constructor(client) {
        super(client, {
            name: "stop",
            description: "Stop the currently being played song.",
            usage: "",
            category: "fun",
            permLevel: 0,
            cooldown: 60000
        });
        
        run(message) {
        message.delete();
              if (message.member.voiceChannel) {
              message.member.voiceChannel.leave()
              message.reply('I have successfully disconected from the channel!').then(m => {m.delete(5000)});
              } else {message.reply('Join the channel that you want me to disconect').then(m => {m.delete(5000)});
            }
  }
