import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('random')
	.setDescription('Give me random wholesome culture.')

export async function execute(interaction:ChatInputCommandInteraction<CacheType>) {
	const request = await fetch('https://wholesomelist.com/api/random')
	const culture = await request.json()
	const item:entry = culture.entry
	console.log(item)

	const embed = new EmbedBuilder()
		.setColor(0xED2553)
		.setTitle(item.title)
		.setURL(item.link)
		.setDescription(item.nh === null ? "Not on NHentai." : /\d+/.exec(item.nh)!.toString())
		.setThumbnail(item.image)
		.addFields(
			{name: 'Pages', value: culture.entry.pages.toString()},
			{name: 'Author', value: culture.entry.author.toString(), inline: true},
			{name: 'Tags', value: culture.entry.tags === null ? "none" : culture.entry.tags.toString()},
		)
	if (culture.entry.note !== null) embed.addFields({name: 'Note', value: culture.entry.note, inline:true})

	return interaction.editReply({embeds: [embed]});
}
