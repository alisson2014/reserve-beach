import axios from "axios";
import api from "../../api";
import { CourtSchedule } from "../../types/court_schedule";

export class CourtScheduleService {
    private static instance: CourtScheduleService;

    private constructor() {}

    public static getInstance(): CourtScheduleService {
        if (!CourtScheduleService.instance) {
            CourtScheduleService.instance = new CourtScheduleService();
        }
        return CourtScheduleService.instance;
    }

    public async getByCourtAndDay(courtId: number, dayOfWeek: number): Promise<CourtSchedule[]> {
        try {
            const { data } = await api.get(`/court_schedules/${courtId}/dayOfWeek/${dayOfWeek}`);
            return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao buscar os agendamentos da quadra.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de busca dos agendamentos da quadra.');
            }
            throw new Error('Ocorreu um erro desconhecido ao buscar os agendamentos da quadra.');
        }
    }

    public async create(courtSchedule: CourtSchedule[]): Promise<{ message: string }> {
        try {
            const { data } = await api.post("/court_schedules", courtSchedule);
            return { message: data.message };
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

    public async deleteByCourtId(id: number): Promise<{ message: string }> {
        try {
            const { data } = await api.delete(`/court_schedules/${id}/court`);
            return { message: data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao excluir os agendamentos.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de exclusão dos agendamentos.');
            }
            throw new Error('Ocorreu um erro desconhecido ao excluir os agendamentos.');
        }
    }
}