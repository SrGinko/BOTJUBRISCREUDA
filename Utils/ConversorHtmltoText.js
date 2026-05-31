const { convert } = require("html-to-text");

function ConversorHtmltoText(html) {
    const text = convert(html, {
        wordwrap: false,
    })
    return text
}

module.exports = { ConversorHtmltoText }