import axios from "axios";
import api from "../../api";
import { Court, CourtCreate } from "../../types/court";

export class CourtService {
    private static instance: CourtService;

    private constructor() {}

    public static getInstance(): CourtService {
        if (!CourtService.instance) {
            CourtService.instance = new CourtService();
        }
        return CourtService.instance;
    }

    public async all(name: string | null = null): Promise<Court[]> {
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

    public async show(id: number): Promise<Court> {
        try {
            const response = await api.get(`/courts/${id}`);
            if (response.status !== 200) {
                throw new Error('Quadra não encontrada.');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Quadra não encontrada.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de busca da quadra.');
            }
            throw new Error('Ocorreu um erro desconhecido ao buscar a quadra.');
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

    public async create(court: CourtCreate): Promise<Court> {
        try {
            const response = await api.post("/courts", court);
            if (response.status !== 201) {
                throw new Error('Erro ao criar a quadra.');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if(error.response.data.errors && typeof error.response.data.errors === 'object') {
                        throw new Error(Object.values(error.response.data.errors).join(', '));
                    }

                    throw new Error(error.response.data.message || 'Erro ao realizar cadastro.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                } 

                throw new Error('Erro ao configurar a requisição de cadastro.');
            } 
            
            throw new Error('Ocorreu um erro desconhecido durante o cadastro.');
        }
    }

    public async update(id: number, court: CourtCreate): Promise<Court> {
        try {
            const response = await api.put(`/courts/${id}`, court);
            if (response.status !== 200) {
                throw new Error('Erro ao atualizar a quadra.');
            }
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if(error.response.data.errors && typeof error.response.data.errors === 'object') {
                        throw new Error(Object.values(error.response.data.errors).join(', '));
                    }

                    throw new Error(error.response.data.message || 'Erro ao realizar cadastro.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                } 

                throw new Error('Erro ao configurar a requisição de cadastro.');
            } 
            
            throw new Error('Ocorreu um erro desconhecido durante o cadastro.');
        }
    }
}