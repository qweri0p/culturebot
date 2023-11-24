import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { API } from "nhentai-api";

const api = new API();

export const data = new SlashCommandBuilder()
    .setName('unwholesome')
    .setDescription('Unwholesome culture commands.')
    .addSubcommand(subcommand =>
        subcommand.setName('random')
            .setDescription('Random unwholesome culture.')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('lookup')
            .setDescription('Get information on your possibly unwholesome culture.')
            .addStringOption(option =>
                option.setName('code')
                    .setDescription('6-digit code that links to unwholesome culture.')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('search')
            .setDescription('Search for unwholesome culture.')
            .addStringOption(option =>
                option.setName('query')
                    .setDescription('What do you want to search for?')
                    .setRequired(true)
            )
    )

export async function execute(interaction:ChatInputCommandInteraction<CacheType>) {

    const embed = new EmbedBuilder()
    .setColor(0xED2553)

    switch (interaction.options.getSubcommand()){

        case 'random':
            const randomCulture = await api.getRandomBook()
            console.log(randomCulture)
            if (randomCulture.isKnown === false) embed.setTitle('Not found ):') 
            else {
                embed.setTitle(randomCulture.title.toString())
                    .setDescription(randomCulture.id.toString())
                    .setThumbnail(randomCulture.cover.toString())
                    .addFields(
                        {name: 'Pages', value: randomCulture.pages.toString()},
                        {name: 'Authors', value: randomCulture.artists.toString(), inline: true},
                        {name: 'Tags', value: randomCulture.tags.toString()},
                        {name: 'Catagories', value: randomCulture.categories.toString(), inline: true},
                        {name: 'Parodies', value: randomCulture.parodies.toString()},
                        {name: 'Characters', value: randomCulture.characters.toString(), inline: true}
                    )
            }
            break;
            
        default: 
            embed.setTitle("What the fuck do you want me to do??????")
            break;
        

    }

    return interaction.editReply({embeds: [embed]})

}