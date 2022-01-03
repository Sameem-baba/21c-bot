const { REST } = require("@discordjs/rest");
const { Route, Routes } = require("discord-api-types/v9");
require("dotenv").config();

module.exports ={
  name: "ready",
  once: "true",
  execute(client, commands) {
    console.log(`${client.user.tag} is ready`);
    client.user.setPresence({ activities: [{ name: '!help', type: "LISTENING" }], status: 'online' });

    const CLIENT_ID = client.user.id;

    const rest = new REST({
      version: "9",
    }).setToken(process.env.TOKEN);

    (async () => {
      try {
        if (process.env.TOKEN === "production") {
          await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands
          });
          console.log("Sucessfully registered commands globally");
        } else {
          await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
            body: commands
          });
          console.log("Sucessfully registered commands locally");
        }
      } catch (err) {
        if (err) console.error(err);
      }
    })();
  }
}