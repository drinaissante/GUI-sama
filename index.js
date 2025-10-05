import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits, Partials } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// initialize database
import { db_init } from "./loaders/firebase-loader.js";
db_init();

import admin from "firebase-admin";
export const db = admin.firestore();

// deploy commands to discord api
import { deploy } from "./util/deploy-commands.js";
(async () => {
  await deploy();
})();

import load_commands from "./loaders/command-loader.js";
(async () => {
  await load_commands(client);
})();

import load_events from "./loaders/event-loader.js";
import { saveJSON } from "./data/jsonHelper.js";
(async () => {
  await load_events(client);
})();

client.login(process.env.DISCORD_TOKEN);

// SIGINT i believe is called on exit/process exit
process.on("SIGINT", () => {
  saveJSON();
  process.exit();
});

import initExpress from "./server/server.js";
initExpress();
