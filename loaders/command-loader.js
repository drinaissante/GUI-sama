import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Collection } from "discord.js";

export default async function load_commands(client) {
  client.commands = new Collection();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);

    client.commands.set(command.data.name, command);
  }
}
