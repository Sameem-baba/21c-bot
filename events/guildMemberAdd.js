/*const Discord = require("discord.js")
const GuildSettings = require("../models/GuildSettings");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const guildSettings = await GuildSettings.findOne({
      guild_id: member.guild.id,
    })

    if (!guildSettings & !guildSettings.welcome_channel_id) {
      return;
    }

      const newMemberEmbed = new Discord.MessageEmbed()
        .setColor("#558aff")
        .setTitle("Welcome")
        .setDescription(`Hello ${member.user}! \n \n Welcome to the ${member.guild.name} Community. We hope that you identify your interests here. Enjoy your stay.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp(new Date())
        .setFooter(`${member.guild.name}`, `${member.guild.iconURL()}`);

      member.guild.channels.cache.get(guildSettings.welcome_channel_id).send({embeds: [newMemberEmbed]})
  }
}*/