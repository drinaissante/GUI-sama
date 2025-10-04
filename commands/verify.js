import {
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { isVerified, setVerified } from "../loaders/firebase-loader.js";

export const data = new SlashCommandBuilder()
  .setName("verify")
  .setDescription(
    "Get the UID of a member. UID is used for basic membership commands!"
  )
  .addStringOption((uid) =>
    uid
      .setName("uid")
      .setDescription("The UID to verify your account.")
      .setRequired(true)
  )
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction) {
  const uid = interaction.options.getString("uid");

  await interaction.reply("Fetching data from database...");

  const already = await isVerified(uid);

  if (already) {
    await interaction.editReply(":exclamation: You are already verified.");
    return;
  }

  const res = await setVerified(uid, interaction.user.username);

  if (res) {
    await interaction.editReply(
      ":white_check_mark: You have been successfully verified!"
    );
  } else {
    await interaction.channel.send(
      ":x: Something went wrong verifiying your UID!"
    );
  }
}
