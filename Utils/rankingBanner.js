const { AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const banners = require('../data/banners')

async function createRankingBanner(user, interaction) {

    const canvas = Canvas.createCanvas(720, 150)
    const ctx = canvas.getContext('2d')

    const userGlobal = await interaction.client.users.fetch(user.id)
    let member 
    try {
        member = await interaction.guild.members.fetch(user.id)
    } catch (error) {
        member = null
    }

    if(!member) {
        return
    }

    const avatarUrl = userGlobal.displayAvatarURL({
        extension: 'png',
        size: 256
    })

    const avatar = await Canvas.loadImage(avatarUrl)

    const background = await Canvas.loadImage(
        banners[user.wallpaper].banner
    )

    ctx.filter = 'blur(6px)'
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'

    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const avatarSize = 80
    const avatarX = 30
    const avatarY = (canvas.height - avatarSize) / 2

    ctx.beginPath()
    ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2 + 5,
        0,
        Math.PI * 2
    )
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
    )
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(
        avatar,
        avatarX,
        avatarY,
        avatarSize,
        avatarSize
    )

    ctx.restore()

    ctx.font = 'bold 30px Sans'
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'middle'

    const nameX = avatarX + avatarSize + 20
    const nameY = canvas.height / 2

    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    ctx.fillText(user.username, nameX, nameY)

    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    return new AttachmentBuilder(
        await canvas.encode('png'),
        { name: `ranking_banner_${user.id}.png` }
    )
}

module.exports = { createRankingBanner }
