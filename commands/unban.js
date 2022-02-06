const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a member")
    .addUserOption((option) =>
      option
        .setName("userid")
        .setDescription("Unbans a member")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      const user = interaction.options.getUser("userid");
      interaction.guild.members.unban(user);
      interaction.reply({ content: `${user.username} has been unbanned` });
    }
  },
};
