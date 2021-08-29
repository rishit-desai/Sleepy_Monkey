const fs = require('fs');
const { prefix } = require('../../config.json');
const bot = require('../main/bot.js')
const { MessageEmbed } = require('discord.js')

module.exports = class Util {

    /**
     * @param {bot} client 
     */
	constructor(client) {
		this.client = client;
    }

    getPrefix(id) {
        if(this.client.cache.config[id] && this.client.cache.config[id].prefix)
            return this.client.cache.config[id].prefix;
        return prefix;
    }
    
	async loadCommands() {
		const commandFiles = fs.readdirSync('./code/commands').filter(file => file.endsWith('.js'));
        commandFiles.forEach(file => {
            const command = require(`../commands/${file}`);
            this.client.commands.set(command.name, command);
        })

        const helperFiles = fs.readdirSync('./code/helper').filter(file => file.endsWith('.js'));
        helperFiles.forEach(file => {
            const command = require(`../helper/${file}`);
            this.client.helper.set(command.name, command);
        })
    }

    getCommand(commandName) {
        const command = this.client.commands.find(c => {
            if(c.name == commandName || (c.aliases && c.aliases.includes(commandName)))
                return c
        })
        return command;
    }

    getDefaultRole(id) {
        let role 
        if(this.client.cache.config[id] || this.client.cache.config[id].welcome_role) role = this.client.cache.config[id].welcome_role
        return role
    }

    getEmbed(message, title, text) {
        let toReturn = new MessageEmbed()
            .setColor('#EA8F77')
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))
            .setAuthor(`${message.guild.name}`, message.guild.iconURL({dynamic : true}))
        if(text) toReturn.setDescription(text);
        if(title) toReturn.setTitle(title)
        return toReturn;
    }

    capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1);

    timer = ms => new Promise( res => setTimeout(res, ms));
};