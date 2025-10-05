import fs from "node:fs";
import path from "node:path";

const __filename = "users.json";
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data", __filename);

let jsonData = {};

let saveTimeout = null;

// Load the JSON file
export function loadJSON() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");

  const data = fs.readFileSync(filePath, "utf-8");

  jsonData = JSON.parse(data);
}

export function getData() {
  return jsonData;
}

export function saveJSON() {
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log(`Saved ${__filename}`);
}

export async function storeUser(username, avatarURL, userID) {
  if (!jsonData[username]) {
    jsonData[username] = {};
  }

  jsonData[username] = {
    avatarURL: avatarURL,
    userID: userID,
  };

  scheduleSave();
}

export async function storeUsers(members, forceResync = false) {
  let updated = false;

  for (const member of members) {
    const { username, avatarURL, userID } = member;

    if (!username || !avatarURL || !userID) continue;

    if (!forceResync && jsonData[username]) continue;

    jsonData[username] = { avatarURL, userID };
    updated = true;
  }

  if (updated || forceResync) {
    scheduleSave();
  }
}

export function getAvatarURL(username) {
  return jsonData[username].avatarURL;
}

export function setAvatarURL(username, avatarURL) {
  jsonData[username].avatarURL = avatarURL;
  scheduleSave();
}

export function getUserID(username) {
  return jsonData[username].userID;
}

export function setUserID(username, userID) {
  jsonData[username].userID = userID;
  scheduleSave();
}

export function findUserByUserID(userID) {
  for (const username in jsonData) {
    if (jsonData[username].userID === userID) {
      return username;
    }
  }

  return undefined;
}

export function findAvatarURLByUsername(user_name) {
  for (const username in jsonData) {
    if (username === user_name) {
      return jsonData[username].avatarURL;
    }
  }

  return undefined;
}

export async function removeUser(username) {
  if (!jsonData[username]) return;

  delete jsonData[username];

  scheduleSave();
}

function scheduleSave(delay = 2000) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveJSON, delay);
}
