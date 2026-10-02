import {Client, Collection} from 'discord.js'

export interface DiscordClient extends Client {
    commands: Collection<string, any>;
}