import { CartItem } from "./cart_items";
import { User } from "./user";

type OPEN = 'op';
type CLOSED = 'cl';
type CANCELED = 'cc';
type EXPIRED = 'ex';

export interface Cart {
    id: number;
    user: User;
    status: OPEN | CLOSED | CANCELED | EXPIRED;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
};