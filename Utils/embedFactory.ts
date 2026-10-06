import { EmbedBuilder, type ColorResolvable } from 'discord.js'
type EmbedOptions = {
    color?: ColorResolvable;
    title?: string;
    description?: string;
    tietle?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    thumbnail?: string;
    image?: string;
    footer?: string;
}


export default function criarEmbed(opts: EmbedOptions = {}) {
    const embed = new EmbedBuilder().setColor(opts.color ?? Math.floor(Math.random() * 0xffffff))

    if (opts.title) embed.setTitle(opts.title)
    if (opts.description) embed.setDescription(opts.description);
    if (opts.fields?.length) embed.addFields(opts.fields);
    if (opts.thumbnail?.startsWith('http')) embed.setThumbnail(opts.thumbnail);
    if (opts.image) embed.setImage(opts.image);
    if (opts.footer) embed.setFooter({ text: opts.footer });

    return embed
}

module.exports = { criarEmbed } 