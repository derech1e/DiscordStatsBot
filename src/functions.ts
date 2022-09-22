import chalk from "chalk"
import {GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel, User} from "discord.js"
import {IUser, OnlineTimeType} from "./types"
import UserDB from "./schemas/User"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const getOnlineTimeForType = async (user: User): Promise<IUser | null> => {
    if(mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundUser = await UserDB.findOne({ userID: user.id })
    if(!foundUser) return null;
    return foundUser;
}

export const setOnlineTimeForType = async (user: User, currentOnlineTimeTyp: OnlineTimeType, newOnlineTimeType: OnlineTimeType, time: number) => {
    if(mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundUser = await UserDB.findOne({ userID: user.id })
    if(!foundUser) return null;
    foundUser.onlineTime[currentOnlineTimeTyp] = time
    foundUser.lastTimeStamp = new Date()
    foundUser.lastTimeTyp = newOnlineTimeType
    foundUser.save()
}