import { JSX, useCallback, useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { PaymentMethodService } from '../../service';
import { PaymentDialogProps } from './types';
import { PaymentMethod } from '../../types/payment_method';

const paymentService = PaymentMethodService.getInstance();

export default function PaymentDialog({
    open,
    isProcessing,
    paymentMethod,
    onClose,
    onConfirm,
    onPaymentMethodChange,
    totalAmount
}: PaymentDialogProps): JSX.Element {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const methods = await paymentService.getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
            console.error("Erro ao buscar métodos de pagamento:", error);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Pagamento</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    Você está prestes a pagar pelos agendamentos selecionados. Por favor, escolha a forma de pagamento.
                </DialogContentText>
                <DialogContentText>
                    Valor total: <strong>R$ {totalAmount}</strong>
                </DialogContentText>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">Forma de Pagamento</InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method-select"
                        value={paymentMethod}
                        label="Forma de Pagamento"
                        onChange={onPaymentMethodChange}
                        disabled={isProcessing}
                    >
                        {paymentMethods.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isProcessing}>
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained" disabled={isProcessing || !paymentMethod}>
                    {isProcessing ? <CircularProgress size={24} /> : "Confirmar e Pagar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}