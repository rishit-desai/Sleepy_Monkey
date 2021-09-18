const { Message } = require('discord.js');
const bot = require("../main/bot")

module.exports = {
    name: "resume",
    aliases: ['rs'],
    description: 'Resumes currently playing song or playlist',
    args: false,
    perms: ['SEND_MESSAGES', 'SPEAK', 'USE_VAD'],
    disp: ['Send Messages', 'Speak', 'Use Voice Activity'],

    /**
    * @param {Message} message
    * @param {bot} client
    */
    command_execute(client, message)
    {
        const player = client.erela.get(message.guild.id);
        const { channel } = message.member.voice;
        let mes;
        if (!player) mes = client.util.getDefaultEmbed("No player for this server!")
        else if (!channel) mes = client.util.getDefaultEmbed("You must be in a voice channel to use this command!")
        else if (!player.paused) mes = client.uti.getDefaultEmbed(`Player is already playing ${player.queue.current}`)
        else
        {
            player.pause(false)
            mes = client.util.getDefaultEmbed(`${player.queue.current} is now playing`)
        }
        return message.reply({ embeds: mes })
    }
}