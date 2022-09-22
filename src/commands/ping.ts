import { SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Zeigt den Ping zum Bot an")
    ,
    execute: async (interaction) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`)
                    .setColor(getThemeColor("text"))
            ]
        })
        setTimeout(() => interaction.deleteReply(), 5000)
    },
    cooldown: 10
}

export default command