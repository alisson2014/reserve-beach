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
}