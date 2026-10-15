export interface SteamGameSearchResult {
    appid: string
    nome: string
}

export interface SteamGameGenre {
    description: string
}

export interface SteamGameCategory {
    description: string
}

export interface SteamGameScreenshot {
    path_full: string
}

export interface SteamGame {
    name: string
    background_raw?: string
    is_free?: boolean
    price_overview?: { final_formatted?: string }
    metacritic?: { score: number; url: string }
    website?: string
    short_description?: string
    release_date?: { coming_soon?: boolean; date?: string }
    genres?: SteamGameGenre[]
    categories?: SteamGameCategory[]
    screenshots?: SteamGameScreenshot[]
    pc_requirements?: { minimum?: string; recommended?: string }
}
