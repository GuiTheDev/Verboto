const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrole')
        .setDescription("Set roles")
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('Select the role')
                .setRequired(true)
        )
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('category')
                .setDescription('To manage or verified role')
                .setRequired(true)
                .addChoices(
                    { name: 'Manager role', value: 'true' },
                    { name: 'Verified role', value: 'false' },
                )),

    async execute(client, interaction, verchannel, permrole, verrole) {
        const optnrole = interaction.options.getRole('role')
        const which = interaction.options.getString('category')
        
        if(interaction.member.roles.cache.has(await permrole.get(interaction.guild.id)) || interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
            if(which == 'true') {
                const roleid = await optnrole.id
                await permrole.set(interaction.guild.id ,roleid)
                await interaction.reply({content: `✅ Set role to <@&${roleid}>`, ephemeral:true})
            } else if(which == 'false') {
                const roleid = await optnrole.id
                await verrole.set(interaction.guild.id ,roleid)
                await interaction.reply({content: `✅ Set role to <@&${roleid}>`, ephemeral:true})
            }
            
        } else {
            await interaction.reply({content: `❌ You need admin permssions to run this command(or the role if not setting for first time)`, ephemeral:true})
        }
    },
};