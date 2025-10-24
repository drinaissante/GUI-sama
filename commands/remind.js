import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { add, list, remove } from "../subcommands/remind.js";
import { set } from "../loaders/firebase-loader.js";

export const data = new SlashCommandBuilder()
  .setName("remind")
  .setDescription("A simple reminder message.")
  .addSubcommand((add) =>
    add
      .setName("add")
      .setDescription("Add a new reminder")
      .addStringOption((time) =>
        time
          .setName("time")
          .setDescription("Time ('5m' for 5 minutes, '3d' for 3 days)")
          .setRequired(true)
      )
      .addStringOption((message) =>
        message
          .setName("message")
          .setDescription("The message you want to remind yourself with.")
          .setRequired(true)
      )
  )
  .addSubcommand((remove) =>
    remove
      .setName("remove")
      .setDescription("Removes a reminder")
      .addIntegerOption((id) =>
        id.setName("id").setDescription("The reminder ID").setRequired(true)
      )
  )
  .addSubcommand(
    (set) =>
      set
        .setName("set")
        .setDescription("Update a reminder")
        .addIntegerOption((id) =>
          id
            .setName("id")
            .setDescription("The reminder ID to update")
            .setRequired(true)
        )
        .addStringOption((msg) =>
          msg
            .setName("message")
            .setDescription("New mesage for the reminder")
            .setRequired(true)
        )
    // add a way to choose which field to update
  )
  .addSubcommand((list) =>
    list.setName("list").setDescription("Show all your active reminders")
  )
  .addSubcommand((clear) =>
    clear.setName("clear").setDescription("Clear all reminders.")
  )
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();

  try {
    switch (sub) {
      case "add":
        await add(interaction);
        break;
      case "remove":
        await remove(interaction);
        break;
      case "set":
        await set(interaction);
        break;
      case "list":
        await list(interaction);
        break;
      case "clear":
        await clear(interaction);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
}
