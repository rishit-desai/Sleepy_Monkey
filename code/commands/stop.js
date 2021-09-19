const { Message } = require("discord.js")
const bot = require('../main/bot')

module.exports = {
    name: "stop",
    aliases: ['st'],
    description: 'Stops currently playing song or playlist',
    args: false,
    perms: ['SEND_MESSAGES', 'SPEAK', 'USE_VAD'],
    disp: ['Send Messages', 'Speak', 'Use Voice Activity'],

    /**
    * @param {Message} message
    * @param {bot} client
    * @param {Array} args
    */
    command_execute(client, message)
    {
        const player = client.erela.get(message.guild.id);
        const { channel } = message.member.voice;
        let mes;
        if (!player) mes = client.util.getDefaultEmbed("No player for this server!")
        else if (!channel) mes = client.util.getDefaultEmbed("You must be in a voice channel to use this command!")
        else
        {
            player.destroy();
            mes = client.util.getDefaultEmbed(`${player.queue.current} has been stopped`)
        }
        return message.reply({ embeds: mes })
    }
}