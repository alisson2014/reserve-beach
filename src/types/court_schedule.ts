import { Court } from "./court";

export interface CourtSchedule {
    id: number;
    courtId: Court['id'];
    startTime: string;
    endTime: string;
    dayOfWeek: number;
};

export type CourtScheduleCreate = Omit<CourtSchedule, 'id'>;