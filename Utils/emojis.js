function getEmoji(name) {
    const emojis = [
        {
            name: 'Burguês',
            emoji: '<a:burgues:1397288292776415342>'
        },
        {
            name: 'Lixeiro',
            emoji: '<a:lixeiro:1396728699537199256>',
        },
        {
            name: 'Minecraft',
            emoji: '<:minecraft:1398106820358176810>'
        },
        {
            name: 'Albion',
            emoji: '<:albion:1271691887606239274>'
        },
        {
            name:'Pokemon',
            emoji: '<:pokemon:1398117301508636784>'
        },
        {
            name: 'Falador Bronze',
            emoji: '<:falabronze:1366816844455088188>'
        },
        {
            name: 'Falador Prata',
            emoji: '<:falaprata:1366816660438253578>'
        },
        {
            name: 'Falador Ouro',
            emoji: '<:falaouro:1366816759990059130>'
        },
        {
            name: 'Falador Diamante',
            emoji: '<:faladiamante:1366816901807997020>'
        },
        {
            name:'Falador Platina',
            emoji: '<:falaplatina:1366816959957827707>'
        },
    ]

    return emojis.find(emoji => emoji.name === name)?.emoji || '';

}

module.exports = { getEmoji }
