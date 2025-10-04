import {
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { getUID } from "../loaders/firebase-loader.js";
import { ids } from "../util/botOptions.js";

export const data = new SlashCommandBuilder()
  .setName("getuid")
  .setDescription(
    "Get your UID. Your UID is used for basic membership commands!"
  )
  .addUserOption((member) =>
    member
      .setName("member")
      .setDescription("Officers - Choose the member to get the UID from.")
      .setRequired(false)
  )
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction) {
  const invoker = interaction.member;
  let member = interaction.options.getMember("member");

  // check first if member is not null
  if (member && !invoker.roles.cache.has(ids.officers)) {
    await interaction.reply({
      content: ":x: You don't have permission to get other members' UID",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  member = member || invoker;

  await interaction.reply({
    content: "Fetching data from database...",
    flags: MessageFlags.Ephemeral,
  });

  const data = await getUID(member.user.username);

  if (data === null) {
    await interaction.editReply(`:x: ${member.user.username} is not verified.`);
    return;
  }

  await interaction.editReply(`${member.user}'s UID is ${data}`);
}
