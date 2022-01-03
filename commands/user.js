const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Replies with user info!"),
    async execute(interaction) {
        interaction.reply({
            content: `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
            emphemeral: true,
        });
    }
}