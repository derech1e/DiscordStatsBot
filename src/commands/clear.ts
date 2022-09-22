import {ChannelType, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../types";

const ClearCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Löscht Nachrichten vom aktuellen Channel")
        .addIntegerOption(option => {
            return option
                .setRequired(true)
                .setMaxValue(1000)
                .setMinValue(1)
                .setName("anzahl")
                .setDescription("Nachrichtenanzahl die gelöscht werden soll")
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async interaction => {
        let messageCount = Number(interaction.options.get("anzahl")?.value)
        interaction.channel?.messages.fetch({limit: messageCount})

            .then(async msgs => {
                if (interaction.channel?.type === ChannelType.DM) return;

                const deletedMessages = await interaction.channel?.bulkDelete(msgs, true)
                if (deletedMessages?.size === 0)
                    await interaction.reply("Es wurden keine Nachrichten gelöscht")
                else
                    await interaction.reply(`Erfolgreich ${deletedMessages?.size} Nachricht(en) gelöscht`)
                setTimeout(() => interaction.deleteReply(), 5000)
            })
    },
    cooldown: 10
}

export default ClearCommand;