import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Basic slash command that replies with Pong!");

export async function execute(interaction) {
  // Start measuring the command processing time
  const startTime = Date.now();

  // Send initial reply and fetch the sent message
  await interaction.reply("Pinging...");

  const message = await interaction.fetchReply();

  // Measure round-trip latency (interaction → Discord → back)
  const roundTripLatency =
    (message.createdTimestamp ?? Date.now()) - interaction.createdTimestamp;

  await new Promise((resolve) => setTimeout(resolve, 50));

  // Get Discord API latency (WebSocket ping)
  const apiLatency = interaction.client.ws.ping;

  // Total processing time (how long the command took to run)
  const processingTime = Date.now() - startTime;

  // Edit the reply with all details
  await interaction.editReply(
    `Pong!\n` +
      `Round-trip latency: ${roundTripLatency}ms\n` +
      `API (WS) latency: ${apiLatency}ms\n` +
      `Command processing time: ${processingTime}ms`
  );
}
