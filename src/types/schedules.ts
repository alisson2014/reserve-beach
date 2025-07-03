import { CourtSchedule } from "./court_schedule";
import { PaymentMethod } from "./payment_method";
import { User } from "./user";

export interface Schedule {
    id: number;
    userId: User['id'];
    courtScheduleId: CourtSchedule['id'];
    totalValue: number;
    paymenMethodId: PaymentMethod['id'];
    transactionId?: string;
    scheduledAt: string;
    createdAt: string;
    updatedAt?: string;
};