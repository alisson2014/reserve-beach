export interface ICourtCreate {
    name: string;
    description?: string;
    imageUrl?: string;
    schedulingFee: number;
    capacity: number;
};