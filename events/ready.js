import { Events } from "discord.js";

import { loadJSON } from "../data/jsonHelper.js";
import { loadChannels, loadRoles, loadMembers } from "../util/botOptions.js";

export const name = Events.ClientReady;
export const once = true;

export async function execute(client) {
  console.log(`\nBot is in ${client.guilds.cache.size} guild(s):`);

  client.guilds.cache.forEach(async (guild) => {
    console.log(
      `- ${guild.name} (ID: ${guild.id}) - ${guild.memberCount} members`
    );

    loadChannels(guild);
    loadRoles(guild);

    await loadMembers(guild);

    console.log(`\nLoaded roles, members and channels at '${guild.name}'\n`);
  });

  console.log(`${client.user.tag} has logged in!`);

  console.log("\nLoading users..");

  loadJSON();

  console.log("Loaded!");
}
