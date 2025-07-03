export interface CartItemsBody {
    scheduleDate: string;
    courtScheduleIds: number[];
};

export interface CartInformation {
    cartItemId: number;
    courtName: string;
    scheduleDate: string;
    courtScheduleId: number;
    startTime: string;
    endTime: string;
    schedulingFee: number;
};