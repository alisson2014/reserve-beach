import { Cart } from "./cart";
import { CourtSchedule } from "./court_schedule";

export interface CartItem {
    id: number;
    cartId: Cart['id'];
    courtSchedule: CourtSchedule;
    scheduleDate: string;
    addedAt: string;
};