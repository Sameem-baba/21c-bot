const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a member")
        .addUserOption((option) => 
            option
                .setName('userid')
                .setDescription("Kicks a member")
                .setRequired(true),
        ),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
			const member = interaction.options.getMember('userid');
            member.kick('');
            interaction.reply({content: `${member.user.username} has been kicked`, empheral: true});
        } else {
            return interaction.reply({content: 'You dont have permission to use this command'})
        }
    }
}