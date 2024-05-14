const {EventEmitter} = require('events')
const eventEmitter = new EventEmitter()

let minecraft 
let stardewvalley

function atualizarMine(minecraft1) {
    minecraft = minecraft1
    eventEmitter.emit('alteraVariaveis', { minecraft })
}
function atualizarStardew(stardewvalley1){
    stardewvalley = stardewvalley1
    eventEmitter.emit('atualizaStardew', {stardewvalley})

}

function getVariaveis() {
    return { minecraft, stardewvalley };
}

module.exports = {
    atualizarMine,
    atualizarStardew,
    getVariaveis,
    eventEmitter
};