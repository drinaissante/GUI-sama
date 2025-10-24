import { Timestamp } from "firebase-admin/firestore";
import { db } from "../index.js";
import { scheduleReminder } from "../subcommands/remind.js";

import cron from "node-cron";
import { updateReminder } from "../data/reminderHelper.js";

export async function scheduleReminders(client) {
  console.log("\nScheduling reminders...");

  const snap = await db.collection("reminders").get();

  if (snap.empty) {
    console.log("No reminders to restore.");
    return;
  }

  let restoredCount = 0;

  for (const doc of snap.docs) {
    const userId = doc.id;
    const data = doc.data();
    const reminders = data.reminders || [];

    if (reminders.length === 0) continue;

    try {
      const user = await client.users.fetch(userId).catch(() => null);

      if (!user) {
        console.warn(`User not found for doc: ${userId}`);
        continue;
      }

      for (const reminder of reminders) {
        scheduleReminder(client, user, reminder);
        restoredCount++;
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (restoredCount > 0) console.log(`Restored ${restoredCount} reminders.`);
  else console.log("No reminders found.");
}

export function startReminderScheduler(client) {
  cron.schedule("* * * * *", async () => {
    console.log("[Scheduler] Checking for due reminders...");

    try {
      const snap = await db.collection("reminders").get();
      const now = Date.now();

      for (const doc of snap.docs) {
        const userId = doc.id;
        const data = doc.data();
        const reminders = data.reminders || [];

        for (const reminder of reminders) {
          const nextRun = reminder.nextRun;

          if (now >= nextRun) {
            await triggerReminder(client, userId, reminder);
          }
        }
      }
    } catch (error) {
      console.error("[Scheduler] Error checking reminders:", error);
    }
  });
}

async function triggerReminder(client, userId, reminder) {
  try {
    const user = await client.users.fetch(userId);
    await user.send(`Reminder #${reminder.id}: ${reminder.message}`);

    console.log(
      `[Scheduler] Sent reminder #${reminder.id} to user ${user.tag}`
    );

    const newNextRun = Date.now() + reminder.interval;
    const docRef = db.collection("reminders").doc(userId);
    const doc = await docRef.get();

    const updatedReminder = {
      ...reminder,
      nextRun: Timestamp.fromMillis(newNextRun),
    };

    // Replace the old reminder with the updated one
    const data = doc.data();
    const reminders = data.reminders || [];

    const updatedReminders = reminders.map((r) =>
      r.id === reminder.id ? updatedReminder : r
    );

    await docRef.set({ reminders: updatedReminders }, { merge: true });
  } catch (error) {
    console.error(
      `[Scheduler] Failed to trigger reminder for ${userId}:`,
      error
    );
  }
}
