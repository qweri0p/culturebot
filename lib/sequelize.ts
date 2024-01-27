import { Sequelize, DataTypes } from "sequelize";
import { Client, Guild, Interaction, User } from "discord.js";
import { fileURLToPath } from "node:url";

const sequelize = new Sequelize('main', 'root', process.env.MYSQL_PW?.toString(), {
    host: 'db',
    dialect: "mysql"
})

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const GuildModel = sequelize.define('guild', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    guildId: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    requestCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isBased: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

const UserModel = sequelize.define('user',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    requestCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
})

export async function setupDB(client:Client) {
    GuildModel.sync()
    UserModel.sync()
    const guilds = client.guilds.cache.map((guild) => guild.id)
    const existingGuildsData = guilds.map((guild) => ({guildId:guild}))

    await GuildModel.bulkCreate(existingGuildsData, { ignoreDuplicates: true })
    console.log('Succesfully put all data about guilds in database.')
    
}
export async function addGuildToDb(guild:Guild) {
    const guildData = ({guildId:guild.id})
    await GuildModel.create(guildData, {ignoreDuplicates: true})
}

export async function removeGuildFromDb(guild:Guild) {
    const tobedeleted = await GuildModel.findOne({
        where: {
            guildId: guild.id
        }
    })
    if (tobedeleted !== null) await tobedeleted.destroy()
    else {
        console.error("Cannot find item in database to be deleted", guild.id)
    }
}

export async function addCountToDb(interaction:Interaction) {
    const [user] = await UserModel.findOrCreate({
        where: { userId: interaction.user.id },
        defaults: { userId: interaction.user.id }
    });

    await user.update({requestCount: await user.get('requestCount') as number +1})

    if (interaction.guildId === null) return //If guildId === null then the interaction was made in a DM.

    const guildEntry = await GuildModel.findOne({ where: { guildId: interaction.guildId } })
    await guildEntry?.update({requestCount: await guildEntry.get('requestCount') as number +1})
}

export async function getGuildsFromDatabase() {
    const listOfGuilds = await GuildModel.findAll()
    const filteredGuilds = listOfGuilds.map(instance => {
        return {
            guildId: instance.get('guildId'),
            isBased: instance.get('isBased')
        }
    })
    return filteredGuilds
}

export async function isGuildBased(guildId:string):Promise<any> {
    const basedness = await GuildModel.findOne({
        where: {
            guildId: guildId
        }
    })
    return basedness?.get('isBased')
}