const { Client , Collection, Intents } = require('discord.js');
const { token } = require('../../config.json');
const call = require('./command.js');
const firebase = require('../extensions/firebase.js'); const util = require('../extensions/util.js');
const emoji = require('../extensions/emojis.js');
const my_intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]

module.exports = class Bot extends Client {
    constructor() {
        super({ intents: my_intents });
        this.once('ready', () => {
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

    }

    async start() {
        await this.util.loadCommands();
        await this.firebase.load_config();
        super.login(token);
    }
}
