import { Events } from "discord.js";
import { loadChannels, loadRoles } from "../util/botOptions.js";

export const name = Events.GuildCreate;
export const once = true;

const ALLOWED_GUILDS = [process.env.CSS_ID];

export async function execute(guild) {
  if (!ALLOWED_GUILDS.includes(guild.id)) {
    console.log(
      `Left unauthorized server: ${guild.name} (ID: ${guild.id}) - ${guild.memberCount} members`
    );
    guild.leave();
  } else {
    loadChannels(guild);
    loadRoles(guild);

    console.log(`\nLoaded roles and channels at '${guild.name}'\n`);
  }
}
