import { createReasonEmbed } from "../embeds/archive_embeds.js";

export async function yes_func(interaction, guild, member) {
  await interaction.update(createReasonEmbed());
}
