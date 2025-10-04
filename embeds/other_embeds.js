import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
} from "discord.js";

export function formatTimestamp(timestamp) {
  if (!timestamp) return "N/A";

  const date = new Date(timestamp);
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  return `<t:${unixTimestamp}:R>`;
}

/*
TODO
  ADD plugin version
*/

export function createLicenseEmbed(plugin, licenseData, user) {
  const licenseEmbed = new EmbedBuilder()
    .setColor("#00D4AA")
    .setTitle("🔐 **LICENSE INFORMATION**")
    .setThumbnail(user.displayAvatarURL())

    .addFields(
      {
        name: "**Network ID**",
        value: `\`${licenseData.network_id || "N/A"}\``,
        inline: true,
      },
      {
        name: "**IP**",
        value: `\`${licenseData.ip || "N/A"}\``,
        inline: false,
      }
    )

    .addFields(
      {
        name: "**License**",
        value: ` \`${licenseData.license || "N/A"}\``,
        inline: false,
      },
      {
        name: "Status",
        value: `\`${licenseData.status.toUpperCase() || "N/A"}\``,
        inline: true,
      }
    )

    .addFields(
      {
        name: "**Bought By**",
        value: `\`${licenseData.bought_by || "N/A"}\``,
        inline: false,
      },
      {
        name: "**Created**",
        value: `${formatTimestamp(licenseData.created_at) || "N/A"}`,
        inline: true,
      }
    )

    .addFields({ name: "\u200b", value: "\u200b", inline: false })

    .addFields({
      name: "**Last Seen**",
      value: `**${formatTimestamp(licenseData.last_seen)}**`,
      inline: true,
    })

    .setFooter({
      text: `OMCLicense Management System • ${user.tag || "N/A"}`,
    })
    .setTimestamp();

  const refresh_revoke = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`refresh_license_${plugin}_${licenseData.license}`)
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(
        `revoke_license_${plugin}_${licenseData.license}_${licenseData.status}`
      )
      .setLabel("Revoke")
      .setStyle(ButtonStyle.Danger)
  );

  return {
    embeds: [licenseEmbed],
    components: [refresh_revoke],
  };
}

export function createRolesEmbed() {
  const roles = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        "Welcome to **OMC**! Please react to any of the following to unlock the server."
      )
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent("📟 - NearChat")
    );

  return {
    components: [roles],
    flags: MessageFlags.IsComponentsV2,
    withResponse: true,
  };
}

export function sendReplyEmbed(sender, reply, commission_channel) {
  const rep = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Send Reply?**`)
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`${sender}: \`${reply}\``)
    );

  // ADD BUTTONS TO SEND OR NOT
  const send_cancel = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`send_reply_${commission_channel}_${reply}`)
      .setLabel("Send")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`cancel_reply`)
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
  );

  return {
    components: [rep, send_cancel],
    flags: MessageFlags.IsComponentsV2,
  };
}

export function sendReplyToCommision(sender, reply) {
  const rep = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**${sender}**:`)
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`\`${reply}\``)
    );

  return {
    components: [rep],
    flags: MessageFlags.IsComponentsV2,
  };
}

export function sendRushEmbed() {
  const rep = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("Is this a rush project?"),
      (textDisplay) =>
        textDisplay.setContent(
          "_You will be charged 16% more of your budget if rush._"
        )
    );

  const rush = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("rush_yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("rush_no")
      .setLabel("No")
      .setStyle(ButtonStyle.Secondary)
  );

  return {
    components: [rep, rush],
    flags: MessageFlags.IsComponentsV2,
  };
}
