import api from "../../api";
import { Schedule } from "../../types/schedules";

type ScheduleCreate = Omit<Schedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export interface ScheduleInfo {
    courtName: string;
    schedulingFee: number;
    scheduledAt: string;
    startTime: string;
    endTime: string;
};

export interface ScheduleAdminInfo {
    userName: string;
    courtName: string;
    schedulingFee: number;
    startTime: string;
    endTime: string;
};

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

    public async info(): Promise<ScheduleInfo[]> {
        try {
            const { data } = await api.get('/schedules');
            return data.data;
        } catch (error) {
            console.error('Error fetching schedules:', error);
            return [];
        }
    }

    public async getToday(): Promise<ScheduleAdminInfo[]> {
        try {
            const { data } = await api.get(`/schedules/today`);
            return data.data;
        } catch (error) {
            console.error('Error fetching schedules by date:', error);
            return [];
        }
    }
}