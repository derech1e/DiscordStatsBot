import {Client, Collection, GatewayIntentBits, PermissionFlagsBits,} from "discord.js";
import {SlashCommand} from "./types";
import {config} from "dotenv";
import {readdirSync} from "fs";
import {join} from "path";

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences]})
config()

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()


const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)