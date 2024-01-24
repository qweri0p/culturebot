import { Sequelize, DataTypes } from "sequelize";
import { Client, Guild } from "discord.js";

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
    isBased: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

export async function setupDB(client:Client) {
    await GuildModel.sync()
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