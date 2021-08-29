const Bot = require('./bot.js')
const { Message } = require('discord.js')

module.exports = {
    name : 'command',
    description : 'Command handler',

    /**
     * @param {Bot} client
     * @param {Message} message
     * @param {string} prefix
     * @returns 
     */
    execute (client, message, prefix) {
        const base = client.util.getEmbed(message, "Command Handler")
        const [commandName,...args] = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);
        const command = client.util.getCommand(commandName, message.guild.id);
        
        if(!command) return;

        if(!message.member.permissions.has(command.perms))
            return base.setDescription(`You do not have the required permisions to use this command\nPermissions required: ${command.disp}`);

        if(command.special_perms)
            if(!(message.member.hasPermission('ADMINISTRATOR') || message.member.roles.cache.has(command.special_perms)))
                return base.setDescription(`You do not have the required permisions to use this command\nSpecial Role required: <@&${command.special_perms}>`);

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage)
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            return base.setDescription(reply);
        }

        try{
            command.execute(client,message,args);
        } catch (error) {
            console.log(`There was a problem executing ${command.name}`);
        }
    }
}