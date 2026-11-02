import { Events, type Interaction } from 'discord.js'
import chalk from 'chalk'
import { handleActionButton } from '../handlers/buttonsHandler'
import { ModalHandleAction } from '../handlers/modalHandler'
import { SelectMenusHandleAction } from '../handlers/selectmenusHandler'
import { criarEmbed } from '../Utils/embedFactory'
import { handleError } from '../handlers/errorsHandler'
import { handleGamesComponent } from '../Commands/games/gamesComponent'
import { autocompleteGames } from '../Commands/games/gamesAutocomplete'
import { autocompleteLoja } from '../Commands/RPG/loja/autocomplete'
import type { DiscordClient } from '../types/DiscordClient'

const erro = chalk.bold.red

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isModalSubmit()) {
            return ModalHandleAction(interaction)
        }

        if (interaction.isStringSelectMenu()) {
            return SelectMenusHandleAction(interaction)
        }

        if (interaction.isButton()) {
            if (interaction.customId.startsWith('games:')) {
                return handleGamesComponent(interaction)
            }

            const res = await handleActionButton(interaction.customId, interaction)
            if (!res.ok) {
                const reply = {
                    embeds: [
                        criarEmbed({
                            description: res.message,
                            color: 'Orange',
                        }),
                    ],
                    flags: 64,
                }
                return interaction.deferred || interaction.replied
                    ? interaction.followUp(reply)
                    : interaction.reply(reply)
            }

            if (!interaction.replied && !interaction.deferred) {
                await interaction.deferUpdate()
            }
        }

        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'loja') {
                await autocompleteLoja(interaction)
            } else if (interaction.commandName === 'games') {
                await autocompleteGames(interaction)
            }
            return
        }

        if (!interaction.isChatInputCommand()) return

        const client = interaction.client as DiscordClient
        const command = client.commands.get(interaction.commandName)
        if (!command) {
            console.error(erro(`Comando ${interaction.commandName} não encontrado`))
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            handleError(interaction, 'Ocorreu um erro ao executar esse comando', 'Erro de execução')
            console.log(error)
        }
    },
}
