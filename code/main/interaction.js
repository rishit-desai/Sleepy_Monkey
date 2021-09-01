const Bot = require('./bot.js')
const { CommandInteraction } = require('discord.js')

module.exports = {
    name : 'command',
    description : 'Command handler',

    /**
     * @param {Bot} client
     * @param {CommandInteraction} interaction
     */
    execute (client, interaction) {
        const base = client.util.getDefaultEmbed("Interaction Handler")
        
        const command = client.util.getCommand(interaction.command.name)

        if(!interaction.member.permissions.has(command.perms)) {
            base.setDescription(`You do not have the required permisions to use this command\nPermissions required: ${command.disp}`)
            return interaction.reply(base)
        }

        if(command.special_perms)
            if(!(interaction.member.permissions.has('ADMINISTRATOR') || interaction.member.roles.cache.has(command.special_perms))) {
                base.setDescription(`You do not have the required permisions to use this command\nSpecial Role required: <@&${command.special_perms}>`)
                return interaction.reply(base)
            }

        try{
            command.interaction_execute(client,interaction);
        } catch (error) {
            console.log(`There was a problem executing ${command.name}\nError: ${error}`);
        }
    }
}