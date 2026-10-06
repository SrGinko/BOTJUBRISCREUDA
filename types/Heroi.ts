export interface Heroi{
    id: string;
    nome: string;
    hp: number;
    attaque: number;
    defense: number;
    level: number;
    xp: number;
    moedas: number;
    armaID: number | null;
    armaduraID: number | null;
    calcaID: number | null;
    userID: string;
}