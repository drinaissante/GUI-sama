import {
  ContainerBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";

export function createQuoteEmbed(quoting, sender) {
  const container = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("**Quotes**"),
      (textDisplay) => textDisplay.setContent(`${sender}: \`${quoting}\``)
    );

  const accept_counter = new ActionRowBuilder().setComponents(
    new ButtonBuilder()
      .setCustomId(`accept_${sender.id}_${quoting}`)
      .setLabel("Accept")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`counter_${sender.id}`)
      .setLabel("Counter")
      .setStyle(ButtonStyle.Secondary)
  );

  return {
    components: [container, accept_counter],
    flags: MessageFlags.IsComponentsV2,
  };
}

export function createThreadEmbed(user) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${user.tag}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor("#00D4AA")
    .setTitle("**Commission**")

    .addFields({
      name: "To reply to this commission, just send a message via this thread and you just have to click 'Accept'",
      inline: true,
    })

    .setTimestamp();

  return {
    embeds: [embed],
  };
}

export function createCounterEmbed(sender, counter, commission_channel) {
  const embed = new EmbedBuilder()
    .setColor("#00D4AA")
    .setTitle(`**${sender.user.tag}'s Counter**`)
    .setThumbnail(sender.displayAvatarURL())

    .addFields({
      name: "",
      value: `${counter}`,
      inline: false,
    })

    .addFields({
      name: "",
      value: `${commission_channel}`,
      inline: false,
    })

    .addFields({
      name: "",
      value: "_If you like this counter offer, click the Accept button._",
      inline: false,
    });

  const accept = new ActionRowBuilder().setComponents(
    new ButtonBuilder()
      .setCustomId(`caccept_${commission_channel.id}_${counter}`)
      .setLabel("Accept")
      .setStyle(ButtonStyle.Primary)
  );

  return {
    embeds: [embed],
    components: [accept],
  };
}

export function createQuotingEmbed(quoting) {
  const container = new ContainerBuilder()
    .setAccentColor(0x00d4aa)
    .addTextDisplayComponents(
      (textDisplay) => textDisplay.setContent("**Quote**"),
      (textDisplay) => textDisplay.setContent(`\`${quoting}\``)
    );

  return {
    components: [container],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  };
}
