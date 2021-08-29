const { Message, CommandInteraction } = require("discord.js");
const bot = require('../main/bot')

module.exports = {
    name : 'ping',
    aliases : [''],
    description : 'hmm',
    usage : '',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : '',
    options: [
        {
            "name": "breed",
            "description": "The breed of penguin",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Magellanic",
                    "value": "magellanic"
                },
                {
                    "name": "Emperor",
                    "value": "emperor"
                },
                {
                    "name": "Chinstrap",
                    "value": "chinstrap"
                },
                {
                    "name": "Gentoo",
                    "value": "gentoo"
                }
            ]
        },
        {
            "name": "stickers",
            "description": "Whether to show only stickers",
            "type": 5,
            "required": false
        }
    ],

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    command_execute (client,message,args) {
        message.reply("no")
    },

    /**
     * @param {bot} client
     * @param {CommandInteraction} interaction
     */
    interaction_execute (client, interaction) {
        interaction.reply("no")
    }
};