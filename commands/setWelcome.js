const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setwelcomechannel")
        .setDescription("Set the welcome message channel")
        .addChannelOption(
            option => option
                .setName("welcome")
                .setDescription("The channel to send welcome messages")
                .setRequired(true),
        ),
    async execute(interation) {
        if (!interation.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            interation.reply('You do not have permission to this command.');
            return;
        }

        GuildSettings.findOne({ guild_id: interation.guild.id }, (err, settings) => {
            if (err) {
                console.log(err);
                interation.reply('An error occurred while trying to set the welcome channel!');
                return;
            }

            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interation.guild.id,
                    welcome_channel: interation.options.getChannel("welcome").id
                })
            } else {
                settings.welcome_channel_id = interation.options.getChannel("welcome").id;
            }

            settings.save(err => {
                if (err) {
                    console.log(err);
                    interation.reply('An error occured while trying to set the welcome channel!');
                    return;
                }

                interation.reply(`Welcome channel has been successfully set to ${interation.options.getChannel("welcome")}`)
            })
        })
    }
}