import axios from "axios";
import api from "../../api";
import { Court } from "../../types/court";
import { ICourtCreate } from "./types";

export class CourtService {
    private static instance: CourtService;

    private constructor() {}

    public static getInstance(): CourtService {
        if (!CourtService.instance) {
            CourtService.instance = new CourtService();
        }
        return CourtService.instance;
    }

    public async findAll(name: string | null = null): Promise<Court[]> {
        try {
            const params = new URLSearchParams();
            if(name) {
                params.append('name', name);
            }
            const { data } = await api.get("/courts", { params });
            return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao buscar quadras.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de busca de quadras.');
            }
            throw new Error('Ocorreu um erro desconhecido ao buscar as quadras.');
        }
    }

    public async setActive(ids: readonly number[], active: boolean): Promise<void> {
        try {
            const response = await api.patch("/courts/active", { ids, active });
            if (response.status !== 200) {
                throw new Error('Erro ao atualizar o status das quadras.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao atualizar o status das quadras.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de atualização do status das quadras.');
            }
            throw new Error('Ocorreu um erro desconhecido ao atualizar o status das quadras.');
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            const response = await api.delete(`/courts/${id}`);
            if (response.status !== 204) {
                throw new Error('Erro ao excluir a quadra.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao excluir a quadra.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de exclusão da quadra.');
            }
            throw new Error('Ocorreu um erro desconhecido ao excluir a quadra.');
        }
    }

    public async create(court: ICourtCreate): Promise<Court> {
        try {
            const response = await api.post("/courts", court);
            if (response.status !== 201) {
                throw new Error('Erro ao criar a quadra.');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao criar a quadra.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de criação da quadra.');
            }
            throw new Error('Ocorreu um erro desconhecido ao criar a quadra.');
        }
    }
}