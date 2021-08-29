const { Message } = require("discord.js");
const bot = require('../main/bot')

module.exports = {
    name : 'ping',
    aliases : [''],
    description : '',
    usage : '',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : '',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    execute(client,message,args){
        message.reply("no")
    }
};