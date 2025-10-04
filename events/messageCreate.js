import { Events } from "discord.js";
import { sendReplyEmbed } from "../embeds/other_embeds.js";
import { findCommissionByThreadId } from "../data/jsonHelper.js";

export const name = Events.MessageCreate;

export async function execute(message) {
  if (message.author.bot) return;

  let content = message.content;

  // check if thread
  if (message.channel.isThread()) {
    // check if a commission thread
    if (message.channel.name.includes("Commission")) {
      const commission_channel = findCommissionByThreadId(message.channel.id);

      if (!commission_channel) {
        console.log(
          "Could not find the commission channel for '%d'",
          message.channel.id
        );

        message.channel.send(
          "Could not find the commission channel for this thread. Please contact the developer."
        );
        return;
      }

      await message.delete();

      await message.channel.send(
        sendReplyEmbed(message.author, content, commission_channel)
      );
    }
  }

  let prefix = "=";
  let args = content.slice(prefix.length).trim().split("/s+/");

  const command = args.shift().toLowerCase();

  // command handlers
  if (command === "ping") {
    await message.channel.send("Pong!");
  } else if (command === "server") {
    await message.channel.send(
      `This server is ${message.guild.name} and has ${message.guild.memberCount} members.`
    );
  } else if (command === "sendroles") {
    message.channel.send(createRolesEmbed()).then((message) => {
      message.react("📟"); // NearChat
    });
  }
}
