import ranking from "../service/ranking";

const { AttachmentBuilder, MediaGalleryBuilder, ContainerBuilder, ThumbnailBuilder, SectionBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const Canvas = require('@napi-rs/canvas');
const { emoji } = require("./emojis")
const { addLVL, addLVLHeroi } = require("../Utils/xp");
const { api } = require("../service/axiosClient");
const { obterUnicoItem } = require("../Utils/itensInventario");
const banners = require("../data/banners");
const { handleError } = require("../handlers/errorsHandler");

export function barraDeXp(cur: number, max: number, len = 10) {
    const filled = Math.round((cur / max) * len)
    const empty = len - filled

    let maxXp = formatXp(max)
    let userXp = formatUserXp(cur)

    return '🟦'.repeat(filled) + '⬛'.repeat(empty) + ` ${userXp}/${maxXp}`
}

export function formatXp(xp: number) {
    const unidades = ['', 'K', 'M', 'B', 'T']

    let index = 0;
    while (xp >= 1000 && index < unidades.length - 1) {
        xp /= 1000;
        index++;
    }

    return `${xp.toFixed(1)}${unidades[index]}`
}

export function formatUserXp(xp: number) {
    const unidades = ['', 'K', 'M', 'B', 'T']

    let index = 0;
    while (xp >= 1000 && index < unidades.length - 1) {
        xp /= 1000;
        index++;
    }

    return `${xp.toFixed(1)}${unidades[index]}`
}

export function formatarItemEquipado(rotulo: string, item: any) {
    if (!item) {
        return `**${rotulo}:** Nenhum item equipado`
    }

    const atributos = []

    if (item.ataque) atributos.push(`\`⚔️ Ataque: ${item.ataque}\``)
    if (item.defesa) atributos.push(`\`🛡️ Defesa: ${item.defesa}\``)
    if (item.heal) atributos.push(`\`❤️ Vida: ${item.heal}\``)
    if (item.mana) atributos.push(`\`🔮 Mana: ${item.mana}\``)
    if (item.chanceStatus) atributos.push(`\`✨ Status: ${item.statusNome} • ${item.chanceStatus}%\``)

    const atributosTexto = atributos.length > 0 ? `\n  ${atributos.join(" | ")}` : ""

    return `**${rotulo}:** ${item.nome}${atributosTexto}`
}


export async function creatPerfil(userId: string, bannerIndex: number, interaction: any, type: string) {

    const agora = new Date()
    const member = await interaction.guild.members.fetch(userId)

    const diffMs = agora.getTime() - member.joinedTimestamp
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

    const cargos = member.roles.cache.filter((role: any) => role.name !== '@everyone' && role.mentionable).map((role: any) => role.toString()).join(' ')
    const conquistas = member.roles.cache.filter((role: any) => role.name !== '@everyone').map((role: any) => emoji(role.name)).join(' ')

    const userData = await api.get(`/usuario/${userId}`).then((res: any) => res.data).catch((err: any) => {
        handleError(interaction, 'Ocorreu um erro ao buscar os dados do usuário', 'Erro de Perfil')
        return null
    })
    const heroiData = await api.get(`/heroi/${userId}`).then((res: any) => res.data).catch((err: any) => {
        return null
    })

    let allUsers = await ranking()

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
        const [arma, armadura, calca] = await Promise.all([
            heroiData.armaID ? obterUnicoItem(heroiData.armaID).catch(() => null) : null,
            heroiData.armaduraID ? obterUnicoItem(heroiData.armaduraID).catch(() => null) : null,
            heroiData.calcaID ? obterUnicoItem(heroiData.calcaID).catch(() => null) : null,
        ])

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

        conteiner.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `## <:usuario:1463846764720422953> Equipamentos \n\n\n > Itens atualmente equipados neste Heroi \n  ${formatarItemEquipado('Arma', arma)} \n\n  ${formatarItemEquipado('Armadura', armadura)} \n\n  ${formatarItemEquipado('Calça', calca)} \n\n`
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
                    heroiData === null ? new ButtonBuilder().setLabel('Criar Heroi').setCustomId(`system:criarheroi:${userId}`).setEmoji('<:usuario:1463846764720422953>').setStyle(ButtonStyle.Success).setDisabled(true) : new ButtonBuilder().setLabel('Ver Herói').setCustomId(`system:verheroi:${userId}`).setEmoji('<:usuario:1463846764720422953>').setStyle(ButtonStyle.Secondary),
                ]
            })
        )
    }


    return { conteiner, attachment }
}