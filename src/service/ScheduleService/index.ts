import api from "../../api";
import { Schedule } from "../../types/schedules";

type ScheduleCreate = Omit<Schedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export class ScheduleService {
    private static instance: ScheduleService;

    private constructor() {}

    public static getInstance(): ScheduleService {
        if (!ScheduleService.instance) {
            ScheduleService.instance = new ScheduleService();
        }
        return ScheduleService.instance;
    }

    public async create(data: ScheduleCreate[]): Promise<void> {
        try {
            await api.post('/schedules', data);
        } catch (error) {
            console.error('Error creating schedules:', error);
        }
    }

    public async all(): Promise<Schedule[]> {
        return [];
    }
}