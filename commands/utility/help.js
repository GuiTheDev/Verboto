const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands'),
    async execute(client, interaction) {
        const responseEmbed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription("/help - Lists all available commands\n/ping - Get the bot's ping\n/setrole - Set roles\n/setverificationchannel - Where channel where users can verify\"\n/verify - Verify command for the users")
            .setFooter({ text: 'Verboto'})
        
        
        await interaction.reply({ embeds: [responseEmbed],ephemeral: true})


    },
};