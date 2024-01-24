import { Sequelize, DataTypes } from "sequelize";
import { Client } from "discord.js";

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

const Guild = sequelize.define('guild', {
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
    await Guild.sync()
    const guilds = client.guilds.cache.map((guild) => guild.id)
    const existingGuildsData = guilds.map((guild) => ({guildId:guild}))

    Guild.bulkCreate(existingGuildsData, { ignoreDuplicates: true })
    console.log('Succesfully put all data about guilds in database.')
    
}