import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message } from "discord.js"
import mongoose from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : CommandInteraction) => void,
    cooldown?: number // in seconds
}

interface OnlineTimeTypes {
    online: number,
    idle: number,
    dnd: number,
}

export interface IUser extends mongoose.Document {
    userID: string,
    userName: string,
    onlineTime: OnlineTimeTypes,
    lastTimeTyp: OnlineTimeType,
    lastTimeStamp: Date
}

export type OnlineTimeType = keyof OnlineTimeTypes
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            MONGO_URI: string,
            MONGO_DATABASE_NAME: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        cooldowns: Collection<string, number>
    }
}