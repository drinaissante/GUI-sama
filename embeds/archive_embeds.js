import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
} from "discord.js";

import { formatTimestamp } from "./other_embeds.js";

const yes_no = new ActionRowBuilder().setComponents(
  new ButtonBuilder()
    .setCustomId(`yes`)
    .setLabel("Yes")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("no")
    .setLabel("No")
    .setStyle(ButtonStyle.Secondary)
);

export function createSureEmbed() {
  const container = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("Are you sure you want to cancel your order?")
    );

  return {
    components: [container, yes_no],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  };
}

export function createArchiveEmbed(user, reason) {
  const container = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents(
          (textDisplay) => textDisplay.setContent(`Archiving ${user}'s ticket`),
          (textDisplay) => textDisplay.setContent("**Archived**"),
          (textDisplay) =>
            textDisplay.setContent(`${formatTimestamp(new Date().getTime())}`)
        )
        .setThumbnailAccessory((thumbnail) =>
          thumbnail.setURL(user.displayAvatarURL())
        )
    )
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("**Reason(s)**"),
      (textDisplay) => textDisplay.setContent(`\`\`\`${reason}\`\`\``)
    );

  return {
    components: [container],
    flags: [MessageFlags.IsComponentsV2],
  };
}

const reason_menu = new StringSelectMenuBuilder()
  .setCustomId("reasons")
  .setMinValues(1)
  .setMaxValues(4)
  .setPlaceholder("Choose your reason here");

export function createReasonEmbed() {
  const container = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("**Archiving**")
    )
    .addActionRowComponents((row) => row.addComponents(reason_menu));

  return {
    components: [container],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  };
}
