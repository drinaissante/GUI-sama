import { getData, storeUser, storeUsers } from "../data/jsonHelper.js";

// ids for specific channels and categories
export const ids = {
  guisama: "1423836793475829771",
  officers: "1400869758957519018",
};

// STORE CHANNELS HERE
export const channels = {};

export function loadChannels(guild) {
  channels.guisama = guild.channels.cache.get(ids.guisama);
}

export const roles = {};

export function loadRoles(guild) {
  roles.officers = guild.roles.cache.get(ids.officers);
}

// on bot ready
export async function loadMembers(guild) {
  try {
    const members = await guild.members.fetch();

    // convert to an array of simplified user data
    const users = members.map((member) => ({
      username: member.user.username,
      nickname: member.nickname || "-",
      joinDate: member.joinedAt
        ? member.joinedAt.toLocaleDateString("en-US", {
            dateStyle: "long",
          })
        : "-",
      avatarURL: member.user.displayAvatarURL({ dynamic: true }),
      userID: member.user.id,
    }));

    await storeUsers(users);

    const newStoredCount = Object.keys(getData()).length;
    if (guild.memberCount !== newStoredCount) {
      console.warn("\nMember updates..");

      await storeUsers(users, true);

      console.log("Resync successful\n");
    } else {
      console.log(`\nSuccessfully synced ${newStoredCount} members.\n`);
    }
  } catch (error) {
    console.error("Error loading members:", error);
  }
}
