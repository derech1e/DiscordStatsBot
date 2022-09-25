import {AttachmentBuilder, ChannelType, EmbedBuilder, SlashCommandBuilder} from "discord.js"
import {getThemeColor} from "../functions";
import {SlashCommand} from "../types";
import {ping} from "minecraft-server-ping";
import {Buffer} from "buffer";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("mc")
        .setDescription("Zeigt dir alle Daten zum aktuellen Minecraft Server an")
    ,
    execute: async (interaction) => {
        const data = await ping("play.nuerk-solutions.de", 25565, {timeout: 1000});
        const modt = data.description.extra?.map(item => item.text).join("");
        const image = Buffer.from(data.favicon?.substr('data:image/png;base64,'.length)!, 'base64');
        const attachment = new AttachmentBuilder(image, {name: "icon.png"});
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${modt}`)
                    .setThumbnail("attachment://icon.png")
                    .setDescription(`Spieler: ${data.players.online}/${data.players.max} ${data.players.sample == undefined ? '' : `(${data.players.sample?.map(item => item.name).join(", ")})`}
                    📡 Ping: ${data.ping}`)
                    .setFooter({
                        iconURL: 'https://media.discordapp.net/stickers/1014163627013582898.webp?size=64',
                        text: `${data.version.name} (${data.version.protocol}) - powered by Nuerk-Solutions`
                    })
                    .setColor(getThemeColor("text"))
            ],
            files: [attachment]
        })
        setTimeout(() => interaction.deleteReply(), 5000)
    },
    cooldown: 10
}

export default command