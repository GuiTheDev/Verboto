const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setverificationchannel')
        .setDescription("Where channel where users can verify")
        .setDMPermission(false),

    async execute(client, interaction, verchannel, permrole) {
        const channel = interaction.channelId

        if(interaction.member.roles.cache.has(await permrole.get(interaction.guild.id)) || interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
            await verchannel.set(interaction.guild.id, channel)
            await interaction.reply({content: `✅ Verification channel is now set to <#${channel}>`, ephemeral:true})

        } else {
            await interaction.reply({content: `❌ You don't have permission to run this command.`, ephemeral:true})
        }
        

        
    },
};