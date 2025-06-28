export interface Court {
    id: number;
    courtTypeId: number;
    name: string;
    description: string | null;
    capacity: number;
    schedulingFee: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};