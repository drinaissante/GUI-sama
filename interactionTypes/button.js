import { yes_func } from "../buttons/yes.js";

export async function executeButton(interaction, guild, member) {
  for (const opt of btn_opt) {
    if (opt.starts) {
      if (interaction.customId.startsWith(opt.id))
        opt.func(interaction, guild, member);
    } else {
      if (interaction.customId === opt.id) opt.func(interaction, guild, member);
    }
  }
}

const btn_opt = [
  {
    id: "yes",
    starts: false,
    func: yes_func,
  },
];
