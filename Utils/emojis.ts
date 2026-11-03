import { Icones } from '../data/emojis'
import { ConquistaEmoji } from '../RPG/handlers/emoji'

export function emoji(name: string) {
    const emoji = Icones.emojis.conquista.find((e: ConquistaEmoji) => e.name === name)
    return emoji ? emoji.icone : null
}
