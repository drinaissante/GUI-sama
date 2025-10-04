import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getFullName } from "../loaders/firebase-loader.js";

export const data = new SlashCommandBuilder()
  .setName("who")
  .setDescription("Get the name of the linked discord account.")
  .addUserOption((member) =>
    member
      .setName("member")
      .setDescription("The member to get the name of.")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction) {
  const member = interaction.options.getMember("member");

  await interaction.reply("Fetching data from database...");

  const data = await getFullName(member.user.username);

  if (data === null) {
    await interaction.editReply(
      ":exclamation: Something went wrong. Please try again."
    );
  } else {
    await interaction.editReply(`${member.user}'s name is ${data}`);
  }
}
