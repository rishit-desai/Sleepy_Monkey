const { Client , Collection, Intents } = require('discord.js');
const { token, test_guilds } = require('../../config.json');
const call = require('./command.js');
const firebase = require('../extensions/firebase.js'); const util = require('../extensions/util.js');
const emoji = require('../extensions/emojis.js');
const my_intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]

module.exports = class Bot extends Client {
    constructor() {
        super({ intents: my_intents });
        this.once('ready', () => {
            this.application?.commands.set(this.commands)
            test_guilds.forEach( id => {
                this.guilds.cache.get(id).commands.set(this.commands)
            })
            console.log('Ready');
            this.user.setPresence({
                activities: [{
                    type: "LISTENING",
                    name: "myself"
                }]
            })
        })

        this.commands = new Collection();
        this.helper = new Collection();
        this.firebase = new firebase(this);
        this.util = new util(this);
        this.emoji = emoji;
        this.cache = {
            config : {},
            voice: {},
            sudo: {}
        }

        // Message Handler
        this.on('messageCreate' , message => {
            if(message.author.bot || !message.guild) return;

            const prefix = this.util.getPrefix(message.guild.id);

            const mention = RegExp(`^<@!${this.user.id}>$`);
            const mentionprefix = RegExp(`^<@!${this.user.id}> `);

            if(message.content.match(mention))
                return message.channel.send(`My prefix for this server is ${prefix}`);

            const finalPrefix = message.content.match(mentionprefix) ? message.content.match(mentionprefix)[0] : prefix;

            if(message.content.startsWith(finalPrefix) && !message.content.substring(finalPrefix.length).startsWith(' '))
                call.execute(this,message,finalPrefix);
        });

        this.on('interactionCreate', interaction => {
            if (!interaction.isCommand()) return;

            let command_name = interaction.commandName

            let com = this.util.getCommand(command_name)

            try {
                com?.interaction_execute(this, interaction)
            } catch (error) {
                console.log(`Error performing interaction-execute for ${command_name}\nError: ${error}`)
            }
        })

    }

    async start() {
        await this.util.loadCommands();
        await this.firebase.load_config();
        super.login(token);
    }
}
