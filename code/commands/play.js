const { Message, CommandInteraction } = require("discord.js");
const bot = require('../main/bot')

module.exports = {
    name : 'play',
    aliases : ['p'],
    description : 'Plays a song or playlist',
    usage : '<song_name/link> || <playlist_link>',
    args : true,
    perms : ['SEND_MESSAGES', 'SPEAK', 'USE_VAD'],
    disp : ['Send Messages', 'Speak', 'Use Voice Activity'],
    options: [
        {
            "name": "song",
            "description": "Search a song or a link",
            "type": 3,
            "required": true,
        }
    ],

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    async command_execute (client,message,args) {
        let res = await client.erela.search(args.join(" "), message.author);

        // Create the player 
        const player = client.erela.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
        });
    
        let track = res.tracks[0];
        // Connect to the voice channel and add the track to the queue
        if (!message.guild.me.voice.channelId)
            player.connect();
        player.queue.add(track);
    
        // Checks if the client should play the track if it's the first one added
        if (!player.playing && !player.paused && !player.queue.size) player.play()

        const mes = client.util.getDefaultEmbed("Added to Queue", `Enqueuing [${track.title}](${track.uri})\n${track.requester}`)
        return message.reply({embeds:[mes]});
    },

    /**
     * @param {bot} client
     * @param {CommandInteraction} interaction
     */
    async interaction_execute (client, interaction) {
        interaction.deferReply()
        let res = await client.erela.search(interaction.options.get("song").value, interaction.member.user);
        const player = client.erela.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
        });
    
        let track = res.tracks[0];
        // Connect to the voice channel and add the track to the queue
        if (!interaction.guild.me.voice.channelId)
            player.connect();
        player.queue.add(track);
    
        // Checks if the client should play the track if it's the first one added
        if (!player.playing && !player.paused && !player.queue.size) player.play()
    
        const mes = client.util.getDefaultEmbed("Added to Queue", `Enqueuing [${track.title}](${track.uri})\n${track.requester}`)
        return interaction.followUp({embeds: [mes]});
      
    }
};