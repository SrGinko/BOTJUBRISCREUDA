const { AttachmentBuilder, MediaGalleryBuilder, ContainerBuilder, ThumbnailBuilder, SectionBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const Canvas = require('@napi-rs/canvas');
const { emoji } = require("./emojis")
const { addLVL, addLVLHeroi } = require("../Utils/xp");
const { ranking } = require("../Controller");
const { api } = require("../Utils/axiosClient");
const banners = require("../data/banners");

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

/** 
* Cria o perfil do usuário
* @param {number} userId - O ID do usuário para o qual criar o perfil
* @param {number} bannerIndex - O índice do banner selecionado pelo usuário
* @param {Interaction} interaction - A interação do Discord para responder
*@param {string} type - O tipo de perfil a ser criado ('usuario' ou 'heroi')
* @returns {Object} Um objeto contendo o container do perfil e o attachment da imagem gerada
*
*/
async function creatPerfil(userId, bannerIndex, interaction, type) {

    const agora = new Date()
    const member = interaction.guild.members.cache.get(userId)

    const diffMs = agora - member.joinedAt
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffMonths / 12)

    let tempoEntrada = ''
    if (diffYears >= 1) {
        const years = diffYears
        const months = diffMonths % 12
        tempoEntrada = `há ${years} ${years === 1 ? 'ano' : 'anos'}` + (months ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : '')
    } else if (diffMonths >= 1) {
        const months = diffMonths
        const days = diffDays % 30
        tempoEntrada = `há ${months} ${months === 1 ? 'mês' : 'meses'}` + (days ? ` e ${days} ${days === 1 ? 'dia' : 'dias'}` : '')
    } else if (diffDays >= 1) {
        tempoEntrada = `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
    } else if (diffHours >= 1) {
        tempoEntrada = `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    } else {
        tempoEntrada = `há pouco tempo`
    }

    const cargos = member.roles.cache.filter(role => role.name !== '@everyone' && role.mentionable).map(role => role.toString()).join(' ')
    const conquistas = member.roles.cache.filter(role => role.name !== '@everyone').map(role => emoji(role.name)).join(' ')

    const response = await api.get(`/usuario/${userId}`)
    const heroiData = await api.get(`/heroi/${userId}`).then(res => res.data).catch(err => {
        return null
    })

    const userData = response.data



    allUsers = await ranking()

    const IdUser = allUsers.map(i => i.id)
    const Ranking = IdUser.indexOf(userId) + 1

    const banner = banners

    var maxXp = await addLVL(userId)

    let xpBar

    const canvas = Canvas.createCanvas(720, 300)

    const ctx = canvas.getContext('2d')
    const background = await Canvas.loadImage(`${banner[bannerIndex].banner}`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'perfil.png' });


    const conteiner = new ContainerBuilder({
        accent_color: banner[bannerIndex].corHEX,
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

    if (type === 'heroi') {

        let maxHeroiXp = await addLVLHeroi(userId)
        xpBar = barraDeXp(heroiData.xp, maxHeroiXp)

        conteiner.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `# <:usuario:1463846764720422953> Perfil do Heroi ${heroiData.nome} \n **<:conquista:1463846748052262988> Nível:** ${heroiData.level} \n **<:conquista:1463846748052262988> XP:** ${xpBar} \n`,
                    })
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder({
                        media: { url: member.displayAvatarURL({ extension: 'png', size: 1024 }) }
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
                content: `## <:estatisitcas:1463846753110331537> Estatísticas \n\n\n > Informações adicionais deste Heroi \n  **❤️ Vida:** ${heroiData.hp} \n **⚔️ Ataque:** ${heroiData.attack} \n **🛡️ Defesa:** ${heroiData.defense} \n **💰 Moedas:** ${heroiData.moeda} \n`
            })
        )

        conteiner.addSeparatorComponents(
            new SeparatorBuilder({
                spacing: SeparatorSpacingSize.Large,
                divider: false
            })
        )
        conteiner.addActionRowComponents(
            new ActionRowBuilder({
                components: [
                    new ButtonBuilder().setLabel('Voltar').setCustomId(`system:verusuario:${userId}`).setEmoji('<:usuario:1463846764720422953>').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setLabel('Alterar Banner').setCustomId(`system:alterar_banner:${userId}`).setEmoji('<:foto:1463846754322747497>').setStyle(ButtonStyle.Primary).setDisabled(userId === interaction.user.id ? false : true),
                ]
            })
        )

    } else if (type === 'usuario') {

        xpBar = barraDeXp(userData.xp, maxXp)

        conteiner.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `# <:usuario:1463846764720422953> Perfil de ${userData.username}    (Top/ #${Ranking}) \n **<:tag:1463846763332108362> Cargos:** ${cargos} \n **<:conquista:1463846748052262988> Nível:** ${userData.nivel} \n **<:conquista:1463846748052262988> XP:** ${xpBar} \n`,
                    })
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder({
                        media: { url: member.displayAvatarURL({ extension: 'png', size: 1024 }) }
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
                content: `## <:estatisitcas:1463846753110331537> Estatísticas \n\n\n > Informações adicionais deste Usuário \n  **<:tag:1463846763332108362> Tags:** ${conquistas} \n **<:data:1463846750665179136> Entrou:** \`\`${tempoEntrada}\`\` \n **<:mensagem2:1463846755538964490> Mensagens:** \`\`${userData.quantidadeMensagens}\`\` \n`
            })
        )

        conteiner.addSeparatorComponents(
            new SeparatorBuilder({
                spacing: SeparatorSpacingSize.Large,
                divider: false
            })
        )
        conteiner.addActionRowComponents(
            new ActionRowBuilder({
                components: [
                    new ButtonBuilder().setLabel('Alterar Banner').setCustomId(`system:alterar_banner:${userId}`).setEmoji('<:foto:1463846754322747497>').setStyle(ButtonStyle.Primary).setDisabled(userId === interaction.user.id ? false : true),
                    heroiData === null ? new ButtonBuilder().setLabel('Criar Heroi').setCustomId(`system:criarheroi:${userId}`).setEmoji('<:usuario:1463846764720422953>').setStyle(ButtonStyle.Success).setDisabled(userId === interaction.user.id ? false : true) : new ButtonBuilder().setLabel('Ver Herói').setCustomId(`system:verheroi:${userId}`).setEmoji('<:usuario:1463846764720422953>').setStyle(ButtonStyle.Secondary),
                ]
            })
        )
    }


    return { conteiner, attachment }
}

module.exports = { creatPerfil }