const { Message, MessageEmbed } = require('discord.js');
const bot = require("../main/bot");
const play = require('./play');

module.exports = {
    name: "queue",
    aliases: ['q', 'qu'],
    description: "Displays currently playing queue",
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
            const queue = player.queue
            mes = new MessageEmbed().setAuthor(`Queue for ${message.guild.name}`);
            const tracks_per_page = 5;
            const page = args.length() && Number(args[0]) ? Number(args[0]) : 1;
            const end = page * tracks_per_page;
            const start = end - tracks_per_page;

            const tracks = queue.slice(start, end);

            if (queue.current) mes.addField("Current", `[${queue.current.title}] (${queue.current.uri})`);

            if (!tracks.length)
            {
                mes.setDescription(`No tracks in ${page > 1 ? `page ${page}` : 'the queue'}.`);
            }
            else
            {
                const to_return = tracks.map((track, i) => `${start + (++1)} - [${track.title}] (${track.uri})`).join("\n");
                mes.setDescription(to_return);
            }
            const maxPages = Math.ceil(queue.length / tracks_per_page);

            mes.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
            
            return message.reply({ embeds: mes });
        }
    }
}