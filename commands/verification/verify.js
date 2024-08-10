const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const { CaptchaGenerator } = require('captcha-canvas');
const options = {height: 200, width: 600};  //options for captcha image
const activeCaptchas = new Map();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription("Verify")
        .setDMPermission(false),

    async execute(client, interaction, verchannel, permrole, verrole) {
        const verid = await verchannel.get(interaction.guild.id)
        const verchannelfromid = client.channels.cache.get(verid)
        const channelexecuted = interaction.channel

        if (verchannelfromid == channelexecuted) {

            if (interaction.member.roles.cache.has(await verrole.get(interaction.guild.id))) return await interaction.reply({content: `❌ You are already verified`, ephemeral:true})

            const captcha = await new CaptchaGenerator(options);
            const buffer = await captcha.generate();
            const attachment = new AttachmentBuilder(buffer, { name: `captcha.png` });
            const user = interaction.guild.members.cache.get(interaction.member.id)
            const mid = interaction.member.id
            await interaction.reply({content: `You have received a DM with a captcha`, ephemeral:true})
    
            await user.send("Please answer the captcha with a DM")
            await user.send({files: [attachment]})
         
            activeCaptchas.set(interaction.member.id, captcha.text);


            const dmChannel = await user.createDM();

            // Set up a message collector to wait for the user's response
            const filter = (message) => {
                // The filter ensures that we only collect messages from the user who received the captcha
                return message.author.id === user.id;
            };
            const roleverified = await verrole.get(interaction.guild.id)
            const collector = dmChannel.createMessageCollector({ filter, time: 300000 }); // 5 minutes timeout
            collector.on('collect', async (message) => {
                const storedCaptcha = activeCaptchas.get(interaction.member.id);


                if (message.content == storedCaptcha) {
                    // If the captcha text is correct, send a success message
                    message.reply('✅ Captcha solved correctly! You are now verified.');
                    activeCaptchas.delete(interaction.member.id)
                    collector.stop(); // Stop the collector after correct answer
                    interaction.member.roles.add(roleverified)
                    interaction.editReply("✅ You are now verified")
                } else {
                    // If the captcha text is incorrect, prompt the user to try again
                    message.reply('❌ Incorrect captcha. Please try again.');
                }
            });
            
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    // If the collector times out without the correct answer
                    user.send('❌ Captcha verification timed out. Please try again.');
                    activeCaptchas.delete(interaction.member.id);
                }
            });
            

        } else {
            await interaction.reply({content: `❌ This command has to be ran in <#${verid}>`, ephemeral:true})
        }
        
    },
};