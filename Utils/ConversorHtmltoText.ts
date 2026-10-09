const { convert } = require("html-to-text");

function ConversorHtmltoText(html: string) {
    const text = convert(html, {
        wordwrap: false,
    })
    return text
}

module.exports = { ConversorHtmltoText }