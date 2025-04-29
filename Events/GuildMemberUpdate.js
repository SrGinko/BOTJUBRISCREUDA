const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember, newMember) {
    const boosterRole = newMember.guild.roles.cache.find(role => role.name === 'Server Booster');
    const burges = newMember.guild.roles.cache.find(role => role.name === 'Burgês');
    if (!boosterRole) return;

    if (!oldMember.roles.cache.has(boosterRole.id) && newMember.roles.cache.has(boosterRole.id)) {
        newMember.guild.channels.cache.get('1031036295482454069').send(`Obrigada ${newMember} por impulsionar o servidor! :heart:`);
        newMember.roles.add(burges).catch();
    }
  },
};