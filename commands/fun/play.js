const Base = require("../../base/Command.js");

module.exports = class Play extends Base {
    constructor(client) {
        super(client, {
            name: "play",
            description: "Play some music from YouTube.",
            usage: "<YouTube URL>",
            category: "fun",
            permLevel: 0,
            cooldown: 60000
        });
        
       
    run(message, args) {
    if (message.channel.name === "dfchat") return super.error("You can't use that here!");
          if(!args[0]) return (message.channel.send({embed: { title: ":x:Error!", "color": 16711680, description: `Specify a YouTube URL to play!`}}).then(m => {m.delete(15000);}))
              if (!message.guild) return;
              if (message.member.voiceChannel) {
                  message.member.voiceChannel.join().then(connection => {
                  message.reply('I have successfully connected to the channel!').then(m => {m.delete(5000)});
                  var VideoID = getYouTubeID(args[0]);
                  fetchVideoInfo(VideoID, function (err, videoInfo) { if (err) throw new Error(err); 
                  var Vd = videoInfo; 
                  
                let richEmbed = new Discord.RichEmbed()
                .setTitle(`Now Playing:`)
                .setDescription(`**Title:** __[${Vd.title}](${Vd.url})__ 
                **By: **${Vd.owner}
                **Date published: **${Vd.datePublished}
                **:eye: **${Vd.views}
                **:thumbsup::skin-tone-1: **${Vd.likeCount} | **:thumbsdown::skin-tone-1: **${Vd.dislikeCount}
                 `)
                .setColor(message.member.displayHexColor)
                message.channel.send({embed: richEmbed});});
                const stream = ytdl(args[0], {filter : 'audioonly'});
                const dispatcher = connection.playStream(stream);
        })
              } else {message.reply('You need to join a voice channel first!').then(m => {m.delete(5000)})}
  }
