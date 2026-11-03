import { api } from './axiosClient'
import { Usuario } from '../types/Usuario'

export default async function ranking(): Promise<Usuario[]> {
    const { data } = await api.get<Usuario[]>(`/usuario`)

    return [...data].sort((a, b) => {
        if (b.nivel === a.nivel) {
            return b.xp - a.xp
        }
        return b.nivel - a.nivel
    })
}