const { Message } = require('discord.js');
const bot = require("../main/bot");
const play = require('./play');

module.exports = {
    name: "loop",
    aliases: ['l', 'lp','repeat','rp','r'],
    usage: "<track> || <queue>",
    description: 'Loops currently playing song or playlist',
    args: true,
    perms: ['SEND_MESSAGES', 'SPEAK', 'USE_VAD'],
    disp: ['Send Messages', 'Speak', 'Use Voice Activity'],

    /**
    * @param {Message} message
    * @param {bot} client
    * @param {Array} args
    */
    command_execute(client, message,args)
    {
        const player = client.erela.get(message.guild.id);
        const { channel } = message.member.voice;
        let mes;
        if (!player) mes = client.util.getDefaultEmbed("No player for this server!")
        else if (!channel) mes = client.util.getDefaultEmbed("You must be in a voice channel to use this command!")
        else
        {
            let trackOrQueue;
            if (args.length) trackOrQueue = args[0].startsWith('t') ? "track" : "queue";
            else trackOrQueue = "track";
            
            if (trackOrQueue == "track")
            {
                player.setTrackRepeat(!player.trackRepeat);
                mes = client.util.getDefaultEmbed(`Track repeat is ${player.trackRepeat ? 'enabled.' : 'disabled.'}`);
            }
            else
            {
                player.setQueueRepeat(!player.queueRepeat);
                mes = client.util.getDefaultEmbed(`Queue repeat is ${player.queueRepeat ? 'enabled' : 'disabled.'}`);
            }
        }
        return message.reply({ embeds: mes })
    }
}