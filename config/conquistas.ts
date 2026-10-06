export interface Conquista {
    messagens: number;
    cargo: string;
    xp: number;
    removerCargoAnterior?: string;
}

export const conquistas: Conquista[] = [
    {
        messagens: 500,
        cargo: 'Falador Bronze',
        xp: 500
    },
    {
        messagens: 1500,
        cargo: 'Falador Prata',
        xp: 1500
    },
    {
        messagens: 3000,
        cargo: 'Falador Ouro',
        xp: 3000
    },
    {
        messagens: 5000,
        cargo: 'Falador Platina',
        xp: 5000
    },
    {
        messagens: 10000,
        cargo: 'Falador Diamante',
        xp: 10000
    }
]