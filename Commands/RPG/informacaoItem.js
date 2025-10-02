const { SlashCommandBuilder } = require("discord.js")
const { obterUnicoItem } = require("../../Utils/itensInventario")
const { criarEmbed } = require("../../Utils/embedFactory")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('infoitem')
        .setDescription("Busca informações de um item")
        .addStringOption(options => options.setName('nome').setDescription('Nome do item').setAutocomplete(true).setRequired(true)),

    async execute(interaction) {
        const itemID = parseInt(interaction.options.getString('nome'))

        if (Number.isNaN(itemID)) {
            return
        }

        const item = await obterUnicoItem(itemID)

        const embed = criarEmbed({
            title: `${item.nome}`,
            description: `${item.descricao}`,
            thumbnail: `${item.imagem}`,
            fields: [
                { name: 'Raridade', value: `${item.raridade}`, inline: false },
                { name: 'Tipo', value: `${item.tipo}`, inline: false },
                { name: 'Preço:', value: `${item.preco}`, inline: true },
                { name: 'Ataque:', value: `${item.ataque ?? 'Não tem esse atributo'}`, inline: true },
                { name: 'defesa:', value: `${item.defesa ?? 'Não tem esse atributo'}`, inline: true },
                { name: 'Vida:', value: `${item.heal ?? 'Não tem esse atributo'}`, inline: true },
            ]
        })

        await interaction.reply({
            embeds: [embed]
        })
    },

}