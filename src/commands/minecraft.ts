import {ChannelType, EmbedBuilder, SlashCommandBuilder} from "discord.js"
import {getThemeColor} from "../functions";
import {SlashCommand} from "../types";
import {ping} from "minecraft-server-ping";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Zeigt dir alle Daten zum aktuellen Minecraft Server an")
    ,
    execute: async (interaction) => {
        const data = await ping("play.nuerk-solutions.de", 25565, {timeout: 1000});
        const modt = data.description.extra?.map(item => item.text).join("");
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Minecraft Server")
                    .setThumbnail("https://media.discordapp.net/stickers/1014163627013582898.webp?size=64")
                    .setDescription(`${modt}\n
                    Spieler: ${data.players.online}/${data.players.max} (${data.players.sample?.map(item => item.name).join(", ")})
                    📡 Ping: ${data.ping}`)
                    .setFooter({iconURL: 'https://media.discordapp.net/stickers/1014163627013582898.webp?size=64', text: `${data.version.name} (${data.version.protocol}) - powered by Nuerk-Solutions`})
                    .setColor(getThemeColor("text"))
            ]
        })
        setTimeout(() => interaction.deleteReply(), 5000)
    },
    cooldown: 10
}

export default command