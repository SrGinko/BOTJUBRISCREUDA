
const Cores = [
    {
        nome: 'Azul',
        corHEX: 0x0000ff,
        corHEX2: '#0000ff',
    },
    {
        nome: 'Amarelo',
        corHEX: 0xffff00,
        corHEX2: '#ffff00',
    },
    {
        nome: 'Verde',
        corHEX: 0x00ff2a,
        corHEX2: '#00ff2a',
    },
    {
        nome: 'Vermelho',
        corHEX: 0xff0000,
        corHEX2: '#ff0000',
    },
    {
        nome: 'Laranja',
        corHEX: 0xffa500,
        corHEX2: '#ffa500',
    },
    {
        nome: 'Ciano',
        corHEX: 0x00ffff,
        corHEX2: '#00ffff',
    },
    {
        nome: 'Magenta',
        corHEX: 0xff00ff,
        corHEX2: '#ff00ff',
    },
    {
        nome: 'Lilás',
        corHEX: 0x9932cc,
        corHEX2: '#9932cc',
    },
    {
        nome: 'Marrom',
        corHEX: 0x8b4513,
        corHEX2: '#8b4513',
    },
    {
        nome: 'Branco',
        corHEX: 0xffffff,
        corHEX2: '#ffffff',
    },
    {
        nome: 'Preto',
        corHEX: 0x292929ff,
        corHEX2: '#292929ff',
    },
    {
        nome: 'Marrom',
        corHEX: 0x532618ff,
        corHEX2: '#532618ff',
    },
    {
        nome:'Ouro',
        corHEX: 0xfc5203,
        corHEX2: '#fc5203',
    },
    {
        nome:'Verde Água',
        corHEX: 0x03fc73,
        corHEX2: '#03fc73',
    },
    {
        nome: 'Warning',
        corHEX: 0xffcc00,
        corHEX2: '#ffcc00',
    },
    {
        name: 'Danger',
        corHEX: 0xff3300,
        corHEX2: '#ff3300',
    },
    {
        name: 'Sucess',
        corHEX: 0x33ff33,
        corHEX2: '#33ff33',
    },
    {
        name: 'Info',
        corHEX: 0x3399ff,
        corHEX2: '#3399ff',
    }

]

function getRandonCores() {
    const cores = Cores.map(cor => cor.corHEX)
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)]
    return corAleatoria
}

module.exports = {Cores, getRandonCores}