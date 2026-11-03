const { convert } = require("html-to-text");

export function ConversorHtmltoText(html: string) {
    const text = convert(html, {
        wordwrap: false,
    })
    return text
}