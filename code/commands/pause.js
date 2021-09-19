const { Message } = require("discord.js");
const bot = require('../main/bot');

module.exports = {
    name: 'pause',
    aliases: ['ps'],
    description: 'Pauses currently playing song or playlist',
    args: false,
    perms: ['SEND_MESSAGES', 'SPEAK', 'USE_VAD'],
    disp: ['Send Messages', 'Speak', 'Use Voice Activity'],
    
    /**
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
     */
    command_execute(client,message)
    {
        const player = client.erela.get(message.guild.id);
        const { channel } = message.member.voice;
        let mes;
        if (!player) mes = client.util.getDefaultEmbed("No player for this server!")
        else if (!channel) mes = client.util.getDefaultEmbed("You must be in a voice channel to use this command!")
        else if (player.paused) mes = client.util.getDefaultEmbed("The player is already paused!")
        else
        {
            player.pause(true);
            mes = client.util.getDefaultEmbed(`${player.queue.current} has been paused`)
        }
        return message.reply({embeds: mes})
    }

}