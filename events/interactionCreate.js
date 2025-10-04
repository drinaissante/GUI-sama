import { Events } from "discord.js";

import { executeChatInputCommand } from "../interactionTypes/chatInputCommand.js";
import { executeButton } from "../interactionTypes/button.js";

export const name = Events.InteractionCreate;

export async function execute(interaction) {
  if (interaction.isChatInputCommand()) {
    await executeChatInputCommand(interaction);
    return;
  }

  const guild = interaction.guild;
  const member = interaction.member;
  if (interaction.isButton()) {
    await executeButton(interaction, guild, member);
    return;
  }
}
