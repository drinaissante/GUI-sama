import {
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";

const omc_logo = new AttachmentBuilder("./assets/OMC.png");

const create_ticket = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(`comm_create`)
    .setLabel("Order Now")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setLabel("Terms of Service")
    .setURL(
      "https://discord.com/channels/731055234800943106/1391957098404909108"
    )
    .setStyle(ButtonStyle.Link)
);

export function createTicketContainer() {
  const ticketEmbed = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addSeparatorComponents((separator) => separator)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents(
          (textDisplay) => textDisplay.setContent("Welcome to **OMC**! "),
          (textDisplay) =>
            textDisplay.setContent(
              "Before ordering, please make sure you have read, understand, and agree to the Terms of Service."
            )
        )
        .setThumbnailAccessory((thumbnail) =>
          thumbnail
            .setDescription("The OMC logo")
            .setURL("attachment://OMC.png")
        )
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        '**You hereby agree to our ToS upon clicking the "Order Now" Button.**'
      )
    );

  return {
    content: "",
    components: [ticketEmbed, create_ticket],
    files: [omc_logo],
    flags: MessageFlags.IsComponentsV2,
  };
}

export function createCommissionEmbedDisabled(
  commission_manager,
  user,
  budget,
  time_frame,
  description,
  rush,
  status,
  commissionChannel
) {
  const commissionEmbed = new EmbedBuilder()
    .setColor("#00D4AA")
    .setTitle("**New Commission**")
    .setThumbnail(user.displayAvatarURL())

    .addFields(
      {
        name: "",
        value: `${commissionChannel}`,
        inline: false,
      },
      {
        name: "**Customer**",
        value: `${user}`,
        inline: false,
      }
    )

    .addFields(
      {
        name: "**Budget**",
        value: `${budget}`,
        inline: true,
      },
      {
        name: "**Timeframe**",
        value: `${time_frame}`,
        inline: true,
      }
    )

    .addFields(
      {
        name: "**Project Description**",
        value: `${description}`,
        inline: false,
      },
      {
        name: "Rush",
        value: rush, // Yes, No, N/A
        inline: false,
      }
    )

    .addFields({ name: "", value: "\u200b", inline: false })

    .addFields({
      name: "**Status**",
      value: status,
      inline: true,
    })

    .setFooter({
      text: "OMC Commissions\t\t\t\t\t",
    })
    .setTimestamp();

  const btn = new ButtonBuilder()
    .setCustomId(`quote_${commissionChannel.id}`)
    .setLabel("Send a Quote")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);

  const quote = new ActionRowBuilder().addComponents(btn);

  return {
    content: `{commission_manager}`, // replace with commission
    embeds: [commissionEmbed],
    components: [quote],
  };
}

export function createCommissionEmbed(
  commission_manager,
  user,
  budget,
  time_frame,
  description,
  rush,
  status,
  commissionChannel
) {
  const commissionEmbed = new EmbedBuilder()
    .setColor("#00D4AA")
    .setTitle("**New Commission**")
    .setThumbnail(user.displayAvatarURL())

    .addFields(
      {
        name: "",
        value: `${commissionChannel}`,
        inline: false,
      },
      {
        name: "**Customer**",
        value: `${user}`,
        inline: false,
      }
    )

    .addFields(
      {
        name: "**Budget**",
        value: `${budget}`,
        inline: true,
      },
      {
        name: "**Timeframe**",
        value: `${time_frame}`,
        inline: true,
      }
    )

    .addFields(
      {
        name: "**Project Description**",
        value: `${description}`,
        inline: false,
      },
      {
        name: "Rush",
        value: rush, // Yes, No, N/A
        inline: false,
      }
    )

    .addFields({ name: "", value: "\u200b", inline: false })

    .addFields({
      name: "**Status**",
      value: status,
      inline: true,
    })

    .setFooter({
      text: "OMC Commissions\t\t\t\t\t",
    })
    .setTimestamp();

  const btn = new ButtonBuilder()
    .setCustomId(`quote_${commissionChannel.id}`)
    .setLabel("Send a Quote")
    .setStyle(ButtonStyle.Primary);

  const quote = new ActionRowBuilder().addComponents(btn);

  return {
    content: `{commission_manager}`, // replace with commission
    embeds: [commissionEmbed],
    components: [quote],
  };
}

const cancel = new ActionRowBuilder().setComponents(
  new ButtonBuilder()
    .setCustomId(`cancel`)
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger)
);

export function createFirstCommEmbeds(budget, time_frame, description) {
  const container = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        "**Thank you for trusting OMC! Please wait for the Commission Managers for assistance.**"
      )
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents(
      (textDisplay) =>
        textDisplay.setContent(
          "We will be sending quotes to you. You can _accept_, _counter_, or _reject_ our offer."
        ),
      (textDisplay) =>
        textDisplay.setContent(
          "You may cancel your order by pressing the _Cancel_ button."
        )
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("**Budget**"),
      (textDisplay) => textDisplay.setContent(`\`\`\`${budget}\`\`\``)
    )
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("**Timeframe**"),
      (textDisplay) => textDisplay.setContent(`\`\`\`${time_frame}\`\`\``)
    )
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("**Description of the Project**"),
      (textDisplay) => textDisplay.setContent(`\`\`\`${description}\`\`\``)
    )
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(
        "**You may not cancel the order once you accept a quote.**"
      )
    );
  return {
    content: "",
    components: [container, cancel],
    flags: MessageFlags.IsComponentsV2,
  };
}
