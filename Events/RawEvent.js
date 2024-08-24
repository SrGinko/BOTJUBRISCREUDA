const { Events, Client, GatewayIntentBits } = require('discord.js')

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(react, usuario) {
        console.log(react, usuario)

        if (react.message.partial) await react.message.fetch();
        if (react.partial) await react.fetch();

        if (usuario.bot) return;

        const emoji = react.emoji;
        const reactedUser = usuario;

        console.log(emoji, reactedUser)
    }
}