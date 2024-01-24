import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
// import { test } from "../lib/sequelize.js";

export const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('this is to test some database shit')

export async function execute(interaction:ChatInputCommandInteraction<CacheType>) {
    // const result:any = await test()
    return interaction.editReply("fuck off")
}