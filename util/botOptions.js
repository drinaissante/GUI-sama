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
