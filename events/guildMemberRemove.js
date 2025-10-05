import { Events } from "discord.js";

import { removeUser } from "../data/jsonHelper.js";

export const name = Events.GuildMemberRemove;

export async function execute(member) {
  console.log(`${member.user.tag} left ${member.guild.name}!`);

  await removeUser(member.user.username);

  console.log(`Removed ${member.user.tag} from json!`);
}
