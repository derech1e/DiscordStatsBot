import {ChannelType, CommandInteraction, EmbedBuilder, SlashCommandBuilder,} from "discord.js"
import {getOnlineTimeForType, getThemeColor} from "../functions";
import {SlashCommand} from "../types";
import UserModel from "../schemas/User";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("ttt")
        .setDescription("(Toggle time tracking) Aktiviere oder deaktiviere die Zeitverfolgung")
    ,
    execute: async (interaction) => {
        let isTracking = true;
        if (await getOnlineTimeForType(interaction.user) != null) {
            isTracking = false;
            await UserModel.findOneAndDelete({userID: interaction.user.id});
        } else {
            let newUser = new UserModel({
                userID: interaction.user.id,
                userName: interaction.user.username,
                lastTimeStamp: new Date(),
                lastTimeTyp: await getStatusForUser(interaction),
                onlineTime: {},
            })
            await newUser.save()
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Zeitverfolgung wurde ${isTracking ? "aktiviert" : "deaktiviert. Alle Daten wurden gelöscht!"}`)
                    .setColor(getThemeColor("text"))
            ]
        })
        setTimeout(() => interaction.deleteReply(), 5000)
    },
    cooldown: 10
}

function getStatusForUser(interaction: CommandInteraction): Promise<String> {
    return new Promise((resolve, reject) => {
        interaction.guild?.members.fetch().then(members => {
            const status = members.filter((member) => !member.user?.bot && member.user.id == interaction.user.id).map((member) => member.presence?.status)
            if (status.length > 0) {
                resolve(status.toString() || "offline")
            } else {
                reject("Error while fetching members status");
            }
        })
    })
}

export default command