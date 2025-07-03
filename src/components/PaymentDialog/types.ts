import { CartInformation } from "../../service/CartService/types";

export interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    totalAmount: number; 
    onConfirmPayment: () => void;
    selectedItems: CartInformation[];
};