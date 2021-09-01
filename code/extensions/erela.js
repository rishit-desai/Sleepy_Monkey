const { Manager } = require('erela.js')
const bot = require('../main/bot')
const { nodes } = require('../../config.json')

module.exports = class Erela extends Manager {
    /**
     * @param {bot} client 
     */
    constructor (client) {
        super({
            nodes,
            send: (id, payload) => client.guilds.cache.get(id)?.shard.send(payload)
        })
        this.client = client;

        this.cache = {}

        this.on("nodeError", (node, error) => {
            console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
        })

        this.on('queueEnd', player => {
            this.cache.startMessage?.delete()
                .catch(ignored => {})
            const message = this.client.util.getDefaultEmbed('End of Queue', 'Queue more commands using the `play` command')
            this.client.channels.cache.get(player.textChannel)?.send({embeds: [message]})
            player.destroy()
        })

        this.on('trackStart', async (player, track) => {
            const message = this.client.util.getDefaultEmbed("Now playing", `[${track.title}](${track.uri})\n\nRequested by: ${track.requester}`)
                .setThumbnail(track.thumbnail)
            this.cache.startMessage = await this.client.guilds.cache.get(player.guild)?.channels.cache.get(player.textChannel)?.send({embeds: [message]})
        })

        this.on('trackEnd', () => {
            this.cache.startMessage?.delete()
                .catch(ignored => {})
        })
    }
}