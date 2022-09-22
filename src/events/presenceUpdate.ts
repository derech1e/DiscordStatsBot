import {Presence} from "discord.js";
import {BotEvent, OnlineTimeType} from "../types";
import {getOnlineTimeForType, setOnlineTimeForType} from "../functions";

const event: BotEvent = {
    name: "presenceUpdate",
    execute: async (oldPresence: Presence, newPresence: Presence) => {
        if (newPresence.user?.bot) return;
        await updateOnlineTime(newPresence);
        console.log(newPresence.user?.username + " is now " + newPresence.status);
    }
}

async function updateOnlineTime(newPresence: Presence) {
    const user = await getOnlineTimeForType(newPresence.user!);
    if (!user) return;

    const lastDate = user?.lastTimeStamp;
    const diff = new Date().getTime() - lastDate?.getTime()!;
    const newDuration = user.onlineTime[user.lastTimeTyp] + diff;
    await setOnlineTimeForType(newPresence.user!, user.lastTimeTyp, newPresence.status as OnlineTimeType, newDuration);
}


export default event;