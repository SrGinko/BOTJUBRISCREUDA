const { Events } = require('discord.js')
const { execute } = require('./ready')

module.exports = {
    name: Events.MessageReactionAdd,
    on: true,

    async execute(reacao, user) {
        if (reacao.message.partial) await reacao.message.fetch();
        if (reacao.partial) await reacao.fetch();

        if (user.bot) return;

        const guild = reacao.message.guild;
        const member = await guild.members.fetch(user.id);
        const emoji = reacao.emoji;

        console.log(member, emoji)

    }
}