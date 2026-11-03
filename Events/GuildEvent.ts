import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } from 'discord.js'
import EventEmitter from 'events'
import criarEmbed from '../Utils/embedFactory'
import type { Role, TextBasedChannel } from 'discord.js'

interface ConquistaEvent {
    conquista: Role | null;
    xp: number;
    user: string;
    channel: TextBasedChannel;
}

interface AddCanalEvent {
    nomeCanal: string;
    CapaCanal: string;
    channel: TextBasedChannel;
}

type GuildEvents = {
    conquista: [payload: ConquistaEvent];
    addcanal: [payload: AddCanalEvent];
}

class GuildEvent extends EventEmitter {
    emit<K extends keyof GuildEvents>(event: K, ...args: GuildEvents[K]): boolean {
        return super.emit(event, ...args);
    }

    on<K extends keyof GuildEvents>(event: K, listener: (...args: GuildEvents[K]) => void): this {
        return super.on(event, listener);
    }
}

const guildEvent = new GuildEvent()

guildEvent.on('conquista', async (payload: ConquistaEvent) => {
    const container = new ContainerBuilder({
        accent_color: 0x5865F2,
        components: [
            new TextDisplayBuilder().setContent('# Conquista Adquirida!').toJSON(),
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false).toJSON(),
            new TextDisplayBuilder().setContent(`Parabéns <@${payload.user}>! Você conquistou o cargo **${payload.conquista?.name}** e ganhou **${payload.xp} XP**!`).toJSON()
        ]
    })

    if (!payload.channel.isSendable()) return

    await payload.channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2
    })

})

export default guildEvent