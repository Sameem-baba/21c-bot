const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a member")
        .addUserOption((option) => 
            option
                .setName('userid')
                .setDescription("Bans a member")
                .setRequired(true),
        ),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const user = interaction.options.getUser('userid');
            interaction.guild.members.ban(user);
            interaction.reply({content: `${user.username} has been banned`})
        }
    }
}