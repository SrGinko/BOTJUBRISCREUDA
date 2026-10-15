import { ComponentType, LabelBuilder, ModalBuilder, TextDisplayBuilder } from 'discord.js'
import type { InventoryEntry } from '../../../types/RPG'

type EquipmentType = 'ARMA' | 'ARMADURA' | 'CALCA'
type SelectOption = { label: string; description: string; value: string }

function buildEquipmentSelect(label: string, description: string, customId: string, options: SelectOption[]): LabelBuilder {
    return new LabelBuilder({
        label,
        description,
        component: {
            type: ComponentType.StringSelect,
            custom_id: customId,
            required: false,
            options: options.length ? options : [{
                label: 'Nenhum item disponível',
                description: `Você não possui ${label.toLowerCase()} no inventário.`,
                value: '0',
            }],
        },
    })
}

function optionsFor(items: InventoryEntry[], type: EquipmentType): SelectOption[] {
    return items
        .filter(({ item }) => item.tipo === type)
        .map(({ item, quantidade }) => ({
            label: item.nome,
            description: `${type === 'ARMA' ? 'Ataque' : 'Defesa'}: ${type === 'ARMA' ? item.ataque ?? 0 : item.defesa ?? 0} | Quantidade: ${quantidade}`,
            value: String(item.id),
        }))
}

export function renderEquipmentModal(userId: string, inventory: InventoryEntry[]): ModalBuilder {
    return new ModalBuilder({ title: 'Equipar itens', custom_id: `rpg:equipar:${userId}` })
        .addTextDisplayComponents(new TextDisplayBuilder({ content: 'Selecione os itens que deseja equipar e confirme.' }))
        .addLabelComponents(
            buildEquipmentSelect('Arma', 'Selecione uma arma.', 'arma', optionsFor(inventory, 'ARMA')),
            buildEquipmentSelect('Armadura', 'Selecione uma armadura.', 'armadura', optionsFor(inventory, 'ARMADURA')),
            buildEquipmentSelect('Calça', 'Selecione uma calça.', 'calca', optionsFor(inventory, 'CALCA')),
        )
}
