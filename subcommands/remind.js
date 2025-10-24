// add, remove, set, list
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { MessageFlags } from "discord.js";

import cron from "node-cron";
import { client, db } from "../index.js";

import {
  clearReminders,
  getReminders,
  hasReminders,
  removeReminder,
  storeReminder,
  updateReminder,
} from "../data/reminderHelper.js";

// cached jobs
const scheduledReminders = new Map();

// re arrange the db
const reindex = (array) => array.map((r, i) => ({ ...r, id: i + 1 }));

export async function add(interaction) {
  const time = interaction.options.getString("time");
  const message = interaction.options.getString("message");

  const user = interaction.user;

  const { ms, cron } = parseTimeString(time);

  if (!ms) {
    return await interaction.reply({
      content:
        "Invalid format. Use '10s' = 10 seconds, '5m' = 5 minutes, '3d' = 3 days.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reminders = getReminders(user.id);

  const newReminder = {
    id: reminders.length + 1,
    message: message,
    interval: ms,
    cronExpr: cron,
    nextRun: Timestamp.fromMillis(Date.now() + ms),
  };

  await storeReminder(user.id, newReminder);

  // scheduleReminder(client, user, newReminder);

  return interaction.reply({
    content: `Added reminder #${newReminder.id} - ${time} - '${message}`,
    flags: MessageFlags.Ephemeral,
  });
}

export async function remove(interaction) {
  const id = interaction.options.getInteger("id");
  const user = interaction.user;

  const reminders = getReminders(user.id);

  const existing = reminders.find((r) => r.id === id);

  if (!existing)
    return await interaction.reply(`No reminder found with ID #${id}`);

  removeReminder(user.id, id);

  const key = `${user.id}_${id}`;

  if (scheduledReminders.has(key)) {
    scheduledReminders.get(key).stop();
    scheduledReminders.delete(key);
  }

  return interaction.reply({
    content: `Removed reminder #${id}.`,
    flags: MessageFlags.Ephemeral,
  });
}

// TODO fields choices
export async function set(interaction) {
  const id = interaction.options.getInteger("id");

  const user = interaction.user;
  const newMessage = interaction.options.getString("message");

  const reminders = getReminders(user.id);
  const existing = reminders.find((r) => r.id === id);

  if (!existing)
    return await interaction.reply(`No reminder found with ID #${id}`);

  await updateReminder(user.id, id, "message", newMessage);

  return interaction.reply(
    `Updated reminder #${id} with message: "${message}"`
  );
}

export async function list(interaction) {
  const user = interaction.user;

  if (!hasReminders(user.id)) {
    return interaction.reply({
      content: "You do not have any reminders yet.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reminders = getReminders(user.id);

  const formatted = reminders
    .map((reminder) => {
      const nextRun = Math.floor(
        (Date.now() + reminders.interval * 60 * 1000) / 1000
      );

      return `**#${reminder.id} - ${reminder.time} - "${reminder.message} | Next: <t:${nextRun}:F> (<t:${nextRun}:R>)"`;
    })
    .join("\n");

  return interaction.reply({
    content: `***Your Reminders:***\n ${formatted}`,
    flags: MessageFlags.Ephemeral,
  });
}

export async function clear(interaction) {
  const user = interaction.user;
  const reminders = getReminders(user.id);

  if (reminders.length === 0) {
    return interaction.reply({
      content: "You have no reminders to clear.",
      flags: MessageFlags.Ephemeral,
    });
  }

  for (const key of scheduledReminders.keys()) {
    if (key.startsWith(user.id)) {
      scheduledReminders.get(key).stop();
      scheduledReminders.delete(key);
    }
  }

  clearReminders(user.id);

  return interaction.reply({
    content: "Successfully cleared all reminders.",
    flags: MessageFlags.Ephemeral,
  });
}

// schedule and removing nalang

export function scheduleReminder(client, user, reminder) {
  const { id, cronExpr, nextRun } = reminder;

  const userId = user.id;
  const now = Math.floor(Date.now() / 1000);
  const delay = nextRun - now;

  if (delay <= 0) {
    trigger(client, userId, reminder);
  } else {
    setTimeout(() => {
      trigger(client, userId, reminder);
    }, delay * 1000);
  }

  const job = cron.schedule(cronExpr, async () => {
    await trigger(client, userId, reminder);
  });

  scheduledReminders.set(`${user.id}_${id}`, job);
}

async function trigger(client, userId, reminder) {
  const { id, message, interval } = reminder;

  try {
    const user = await client.users.fetch(userId);
    await user.send(`:exclamation: Reminder #${id}: ${message}`);
    console.log(`Sent reminder #${id} to ${user.tag}`);

    const nextRun = Math.floor(Date.now() / 1000 + interval * 60);
    const docRef = db.collection("reminders").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) return;

    const userData = doc.data();
    const reminders = userData.reminders || [];

    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, nextRun } : reminder
    );

    // update cache
    updateReminder(userId, id, "nextRun", updated);

    await docRef.update({ reminders: updatedReminders });
    console.log(`Updated ${id}. Next run is ${nextRun}`);
  } catch (error) {
    console.error(error);
  }
}

const regExp = /^(\d+)([smhdw])$/i;
const multipliers = {
  s: {
    ms: 1000,
    cron: (v) => `*/${v} * * * * *`, // every v seconds
  },
  m: {
    ms: 1000 * 60,
    cron: (v) => `*/${v} * * * *`, // every v minutes
  },
  h: {
    ms: 1000 * 60 * 60,
    cron: (v) => `0 */${v} * * *`, // every v hours
  },
  d: {
    ms: 1000 * 60 * 60 * 24,
    cron: (v) => `0 0 */${v} * *`, // every v days
  },
  w: {
    ms: 1000 * 60 * 60 * 24 * 7,
    cron: (v) => `0 0 * * ${v % 7}`, // weekly
  },
};

function parseTimeString(time) {
  if (!time) return null;

  const match = time.match(regExp);
  if (!match) return null;

  const val = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  const unitData = multipliers[unit];

  const ms = val * unitData.ms;
  const cron = unitData.cron(val);

  return { ms, cron };
}
