import admin from "firebase-admin";
import { db } from "../index.js";

export function db_init() {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE.replace(/\\n/g, "\n"),
    }),
  });
}

export async function getUserProfile(uid) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      console.log("No user exists"); // send discord
      return null;
    }

    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUID(discord) {
  try {
    const q = db.collection("users").where("discord", "==", discord);
    const snap = await q.get();

    if (snap.empty) return null;

    return snap.docs[0].get("uid");
  } catch (error) {
    console.error("Error fetching uid:", error);
    return [];
  }
}

export async function setUserProfile(uid, data) {
  try {
    await db
      .collection("users")
      .doc(uid)
      .set({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log("User profile set update successful"); // send discord
  } catch (error) {
    console.error("Error setting user profile:", error);
  }
}

export async function isVerified(uid) {
  try {
    const docRef = db.collection("users").doc(uid);
    const snap = await docRef.get();

    if (!snap.exists) return false; // no document under uid

    const data = snap.data();
    return data.discord_verified === true;
  } catch (error) {
    console.error("Error checking verification:", error);
    return false;
  }
}

export async function setVerified(uid, username) {
  try {
    const docRef = db.collection("users").doc(uid);
    const snap = await docRef.get();

    if (!snap.exists) {
      console.log(`No user found with uid: ${uid}`);
      return false;
    }

    const data = snap.data();

    // this ensures that only those who are set as the discord can verify their own firestore data
    if (data.discord !== username) {
      console.log(
        `Discord mismatch. Expected: ${data.discord}, Got: ${username}`
      );
      return false;
    }

    await docRef.update({
      discord_verified: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`${uid} - ${username} has been verified.`);
    return true;
  } catch (error) {
    console.error("Error updating verification:", error);
    return false;
  }
}

export async function getFullName(discord) {
  try {
    const q = db
      .collection("users")
      .where("discord", "==", discord)
      .select("name", "middle_initial", "last_name");

    const snap = await q.get();

    if (snap.empty) return null;

    const data = snap.docs[0].data();

    return `${data.name ?? ""} ${data.middle_initial ?? ""} ${
      data.last_name ?? ""
    }`;
  } catch (error) {
    console.error("Something went wrong fetching full name:", error);
    return null;
  }
}

// /update <uid> <type:discord> <value>
export async function set(uid, type, value) {
  try {
    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          [type]: value,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    console.log(`User profile '${type}' set update successful`); // send discord
  } catch (error) {
    console.error(`Error setting ${type} user profile:`, error);
  }
}
