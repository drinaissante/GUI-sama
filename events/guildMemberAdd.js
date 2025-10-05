import { Events } from "discord.js";

import { storeUser } from "../data/jsonHelper.js";

export const name = Events.GuildMemberAdd;

export async function execute(member) {
  console.log(`${member.user.tag} joined ${member.guild.name}!`);

  await storeUser(
    member.user.username,
    member.user.displayAvatarURL({ dynamic: true }),
    member.user.id
  );

  console.log(`Loaded ${member.user.tag} to json!`);
}
