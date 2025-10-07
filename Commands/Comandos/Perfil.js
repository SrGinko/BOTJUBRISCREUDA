const { SlashCommandBuilder, AttachmentBuilder, MediaGalleryBuilder, ContainerBuilder, MessageFlags, ThumbnailBuilder, SectionBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } = require("discord.js")
const banners = require("../../data/banners");
const { Hoje } = require("../../Utils/date");
const { addLVL } = require("../../Utils/xp");
const { ranking } = require("../../Controller");
const { api } = require("../../Utils/axiosClient");
const { criarEmbed } = require("../../Utils/embedFactory");
const { icone, emoji } = require("../../Utils/emojis");
const emojisData = require("../../data/emojis");
const Canvas = require('@napi-rs/canvas');

function barraDeXp(cur, max, len = 10) {
    const filled = Math.round((cur / max) * len)
    const empty = len - filled

    let maxXp = formatXp(max)
    let userXp = formatUserXp(cur)

    return '🟦'.repeat(filled) + '⬛'.repeat(empty) + ` ${userXp}/${maxXp}`
}

function formatXp(xp) {
    const unidades = ['', 'K', 'M', 'B', 'T']

    xp = parseInt(xp)

    let index = 0;
    while (xp >= 1000 && index < unidades.length - 1) {
        xp /= 1000;
        index++;
    }

    return `${xp.toFixed(1)}${unidades[index]}`
}

function formatUserXp(xp) {
    const unidades = ['', 'K', 'M', 'B', 'T']

    xp = parseInt(xp)

    let index = 0;
    while (xp >= 1000 && index < unidades.length - 1) {
        xp /= 1000;
        index++;
    }

    return `${xp.toFixed(1)}${unidades[index]}`
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP')
        .addUserOption(options => options.setName('user').setDescription('Nome do usuário')),


    async execute(interaction) {

        const { options } = interaction

        const userGlobal = options.getUser('user') || interaction.user
        let userId = userGlobal.id

        try {

            await interaction.deferReply();

            if (userGlobal.bot) {
                await interaction.editReply({
                    embeds: [criarEmbed({
                        description: 'Bots não tem perfil',
                        color: 'Red'
                    })], flags: 64
                })

                return
            }


            const agora = await Hoje()
            const member = interaction.guild.members.cache.get(userId)
            const dataEntrada = agora.ano - member.joinedAt.getFullYear()

            let ano = ' Ano'
            if (dataEntrada > 1) ano = ' Anos'

            const cargos = member.roles.cache.filter(role => role.name !== '@everyone' && role.mentionable).map(role => role.toString()).join(' ')
            const conquistas = member.roles.cache.filter(role => role.name !== '@everyone').map(role => { return emoji(role.name) }).join(' ')
            const estatisitcas = await icone(interaction.guild, 'Estatistica')
            const usuario = await icone(interaction.guild, 'Usuario')
            const tag = await icone(interaction.guild, 'tags')
            const data = await icone(interaction.guild, 'data')
            const mensagens = await icone(interaction.guild, 'mensagens')
            const conquistaIcon = await icone(interaction.guild, 'conquista')

            const response = await api.get(`/usuario/${userId}`)

            const user = response.data

            allUsers = await ranking()

            const IdUser = allUsers.map(i => i.id)
            const Ranking = IdUser.indexOf(userId) + 1

            const banner = banners

            var maxXp = await addLVL(userId)

            const xpBar = barraDeXp(user.xp, maxXp)

            const canvas = Canvas.createCanvas(720, 300)

            const ctx = canvas.getContext('2d')
            const background = await Canvas.loadImage(`${banner[user.wallpaper].banner}`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'perfil.png' });


            const conteiner = new ContainerBuilder({
                accent_color: banner[user.wallpaper].corHEX,
                components: [
                    new MediaGalleryBuilder({
                        items: [
                            {
                                media: {
                                    url: `attachment://perfil.png`

                                }
                            }
                        ]
                    }),
                ]
            })

            conteiner.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )

            conteiner.addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `# ${usuario} Perfil de ${user.username}    (Top/ #${Ranking}) \n **${tag} Cargos:** ${cargos} \n **${conquistaIcon} Nível:** ${user.nivel} \n **${conquistaIcon} XP:** ${xpBar} \n`,
                        })
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder({
                            media: { url: userGlobal.displayAvatarURL({ extension: 'png', size: 1024 }) }
                        })
                    )
            )

            conteiner.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large,
                    divider: false
                })
            )

            conteiner.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `## ${estatisitcas} Estatísticas \n\n\n > Informações adicionais deste Usuário \n  **${tag} Tags:** ${conquistas} \n **${data} Entrou há** \`\`${dataEntrada + ano}\`\` \n **${mensagens} Mensagens:** \`\`${user.quantidadeMensagens}\`\` \n`
                })
            )

            await interaction.editReply({ components: [conteiner], files: [attachment], flags: [MessageFlags.IsComponentsV2] });

        } catch (error) {
            console.log(error)

        }
    }
}