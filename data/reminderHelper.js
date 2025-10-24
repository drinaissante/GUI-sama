import fs from "node:fs";
import path from "node:path";
import { db } from "../index.js";
import { FieldValue } from "firebase-admin/firestore";

const __filename = "reminders.json";
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data", __filename);

let jsonData = {};

let saveTimeout = null;

// Load the JSON file
export function loadReminders() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");

  const data = fs.readFileSync(filePath, "utf-8");

  jsonData = JSON.parse(data);
}

export function getData() {
  return jsonData;
}

export function saveReminders() {
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log(`Saved ${__filename}`);
}

export async function storeReminder(id, reminder) {
  if (!jsonData.users[id]) {
    jsonData.users[id] = { reminders: [] };
  }

  jsonData.users[id].reminders.push({ ...reminder });

  await db
    .collection("reminders")
    .doc(id)
    .set({ reminders: FieldValue.arrayUnion(reminder) }, { merge: true });

  console.log(jsonData);

  scheduleSave();
}

export function hasReminders(id) {
  const user = jsonData?.users?.[id];
  return user && user.reminders.length > 0;
}

export function getReminders(id) {
  return jsonData?.users?.[id]?.reminders || [];
}

export function getReminderById(userId, id) {
  const reminders = getReminders(userId);

  return reminders.find((r) => r.id === id) || null;
}

// TODO other fields

export async function updateReminder(userId, id, field, newValue) {
  const userData = getReminders(userId);

  if (!userData) {
    console.error(`No cached data found for user ID: ${userId}`);
    return null;
  }

  const reminders = userData.reminders || [];
  const reminderIdx = reminders.findIndex((r) => r.id === id);

  if (reminderIdx === -1) {
    console.error(`Reminder #${id} not found.`);
    return;
  }

  reminders[reminderIdx][field] = newValue;

  await db.collection("reminders").doc(id).update({ reminders });

  scheduleSave();
}

export async function removeUser(id) {
  if (!jsonData.users[id]) return;

  delete jsonData.users[id];

  await db.collection("reminders").doc(id).delete();

  scheduleSave();
}

export async function clearReminders(id) {
  if (!jsonData.users[id]) return;

  jsonData.users[id].reminders = {};

  await db.collection("reminders").doc(id).set({ reminders: [] });

  scheduleSave();
}

export async function removeReminder(userId, id) {
  const userData = jsonData.users[userId];

  if (!userData) return;

  const reminders = userData.reminders;
  const idx = reminders.find((r) => r.id === id);

  if (idx === -1) return false;

  reminders.splice(idx, 1);

  reminders.forEach((reminder, i) => {
    reminder.id = i + 1;
  });

  await db
    .collection("reminders")
    .doc(userId)
    .set({ reminders }, { merge: true });
}

function scheduleSave(delay = 2000) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveReminders, delay);
}
