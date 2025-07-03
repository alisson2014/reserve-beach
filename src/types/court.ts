import { CourtSchedule } from "./court_schedule";

export interface Court {
    id: number;
    courtTypeId: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    capacity: number;
    schedulingFee: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    schedules: CourtSchedule[];
};

export type CourtCreate = Pick<Court, 'name' | 'description' | 'imageUrl' | 'schedulingFee' | 'capacity'>;