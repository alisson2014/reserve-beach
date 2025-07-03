export interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    totalAmount: number; 
    onConfirmPayment: () => void;
};