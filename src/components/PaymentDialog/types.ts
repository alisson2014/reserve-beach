import { SelectChangeEvent } from "@mui/material";

export interface PaymentDialogProps {
    open: boolean;
    isProcessing: boolean;
    paymentMethod: string;
    onClose: () => void;
    onConfirm: () => void;
    onPaymentMethodChange: (event: SelectChangeEvent<string>) => void;
    totalAmount: number; 
};