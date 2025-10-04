import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Basic slash command that replies with Pong!");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}
