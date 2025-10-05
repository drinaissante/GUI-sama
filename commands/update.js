import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { set } from "../loaders/firebase-loader.js";

export const data = new SlashCommandBuilder()
  .setName("update")
  .setDescription("Updates database values.")
  .addStringOption((uid) =>
    uid.setName("uid").setDescription("The UID of the user").setRequired(true)
  )
  .addStringOption((type) =>
    type
      .setName("type")
      .setDescription("Type of value you want to update")
      .setRequired(true)
      .addChoices(
        { name: "Discord", value: "discord" },
        { name: "Email", value: "email" },
        { name: "Name", value: "name" },
        { name: "Middle", value: "middle_initial" },
        { name: "LastName", value: "last_name" },
        { name: "Discord", value: "discord" }
      )
  )
  .addStringOption((value) =>
    value.setName("value").setDescription("The new value").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setContexts(InteractionContextType.Guild);

// /update <uid> <type:discord> <value>
export async function execute(interaction) {
  try {
    const uid = interaction.options.getString("uid");
    const theType = interaction.options.getString("type");
    const value = interaction.options.getString("value");

    await set(uid, theType, value);

    await interaction.reply(`Updated ${theType} for ${uid} to '${value}'`);
  } catch (err) {
    console.error(err);
    await interaction.reply(
      `Something went wrong '${err.message}. Please try again.`
    );
  }
}
