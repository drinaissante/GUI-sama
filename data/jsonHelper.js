import fs from "node:fs";
import path from "node:path";

const __filename = "commissions.json";
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data", __filename);

// const commission_channel = ids.commissions_channel;

let jsonData = {};

// Load the JSON file
export function loadJSON() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");

  const data = fs.readFileSync(filePath, "utf-8");

  jsonData = JSON.parse(data);
}

export function saveJSON() {
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log(`Saved ${__filename}`);
}

export async function storeCommission(
  channelId,
  messageId,
  threadId,
  budget_,
  time_frame_,
  description_,
  rush_,
  status_
) {
  if (!jsonData[channelId]) {
    jsonData[channelId] = {};
  }

  jsonData[channelId] = {
    commission_message_id: messageId,
    thread: threadId,
    budget: budget_,
    time_frame: time_frame_,
    description: description_,
    rush: rush_,
    status: status_,
  };

  scheduleSave();
}

export function getStatus(channelId) {
  return jsonData[channelId].status;
}

export function setStatus(channelId, status) {
  jsonData[channelId].status = status;
  scheduleSave();
}

export function getRush(channelId) {
  return jsonData[channelId].rush;
}

export function setRush(channelId, rush) {
  jsonData[channelId].rush = rush;
  scheduleSave();
}

export function getCommissions(channelId) {
  return jsonData[channelId] || {};
}

export function getThread(channelId) {
  return jsonData[channelId].thread;
}

export function getCommissionMessage(channelId) {
  return jsonData[channelId].commission_message_id;
}

export function getBudget(channelId) {
  return jsonData[channelId].budget;
}

export function setBudget(channelId, budget) {
  jsonData[channelId].budget = budget;
  scheduleSave();
}

export function getTimeFrame(channelId) {
  return jsonData[channelId].time_frame;
}

export function getDescription(channelId) {
  return jsonData[channelId].description;
}

export function findCommissionByMessage(channelId, messageId) {
  return (jsonData[channelId] || []).find(
    (entry) => entry.commission_message === messageId
  );
}

export function findCommissionByThreadId(threadId) {
  for (const channelId in jsonData) {
    if (jsonData[channelId].thread === threadId) {
      return channelId;
    }
  }

  return undefined;
}

export function removeCommission(channelId, messageId) {
  if (!jsonData[channelId]) return;

  jsonData[channelId] = jsonData[channelId].filter(
    (entry) => entry.commission_message !== messageId
  );

  if (jsonData[channelId].length === 0) delete jsonData[channelId];

  scheduleSave();
}

let saveTimeout;
function scheduleSave(delay = 2000) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveJSON, delay);
}
