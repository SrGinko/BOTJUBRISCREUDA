const { EmbedBuilder } = require('discord.js')

/**
 * 
 * @param {Object} opts 
 * @param {String} [opts.title] 
 * @param {String} [opts.description] 
 * @param {String} [opts.color] 
 * @param {String} [opts.fields] // [{name, value, inline}] 
 * @param {String} [opts.thumbnail]  
 * @param {String} [opts.image]  
 * @param {String} [opts.footer]  
 * 
 * @returns 
 */
function criarEmbed(opts = {}) {
    const embed = new EmbedBuilder().setColor(opts.color ?? 'Random')

    if (opts.title) embed.setTitle(opts.title)
    if (opts.description) embed.setDescription(opts.description);
    if (opts.fields?.length) embed.addFields(opts.fields);
    if (opts.thumbnail?.startsWith('http')) embed.setThumbnail(opts.thumbnail);
    if (opts.image) embed.setImage(opts.image);
    if (opts.footer) embed.setFooter({ text: opts.footer });

    return embed
}

module.exports = { criarEmbed } 