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
        corHEX: 0x00ff00,
        corHEX2: '#00ff00',
    },
    {
        nome: 'Vermelho',
        corHEX: 0xff0000,
        corHEX2: '#ff0000',
    },
    {
        nome: 'Roxo',
        corHEX: 0x800080,
        corHEX2: '#800080',
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
        nome: 'Rosa',
        corHEX: 0xffc0cb,
        corHEX2: '#ffc0cb',
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
        nome: 'Cinza',
        corHEX: 0x808080,
        corHEX2: '#808080',
    },
    {
        nome: 'Branco',
        corHEX: 0xffffff,
        corHEX2: '#ffffff',
    },
    {
        nome: 'Preto',
        corHEX: 0x000000,
        corHEX2: '#000000',
    },
    {
        nome: 'Marrom Claro',
        corHEX: 0xd2b48c,
        corHEX2: '#d2b48c',
    },
    {
        nome:'ouro',
        corHEX: 0xfc5203,
        corHEX2: '#fc5203',
    },
    {
        nome:'Verde Água',
        corHEX: 0x03fc73,
        corHEX2: '#03fc73',
    }


]

function getRandonCores() {
    const cores = Cores.map(cor => cor.corHEX)
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)]
    return corAleatoria
}

module.exports = {Cores, getRandonCores}