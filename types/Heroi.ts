export interface Heroi {
    id?: string
    nome: string
    hp: number
    level: number
    xp: number
    moeda: number
    attack: number
    defense: number
    armaID: number | null
    armaduraID: number | null
    calcaID: number | null
    userID: string
}
