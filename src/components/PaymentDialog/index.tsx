import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
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
    Typography,
} from '@mui/material';
import { PaymentMethodService, ScheduleService } from '../../service';
import { PaymentDialogProps } from './types';
import { PaymentMethod } from '../../types/payment_method';
import { useToast } from '../../contexts';

const paymentService = PaymentMethodService.getInstance();
const scheduleService = ScheduleService.getInstance(); 

export default function PaymentDialog({
    open,
    onClose,
    totalAmount,
    onConfirmPayment,
    selectedItems
}: PaymentDialogProps): JSX.Element {
    const [paymentMethod, setPaymentMethod] = useState<number | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { showToast } = useToast();

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const methods = await paymentService.all();
            setPaymentMethods(methods);
        } catch (error) {
            console.error("Erro ao buscar métodos de pagamento:", error);
        }
    }, []);

    const onConfirm = useCallback(async () => {
        if(!paymentMethod) return;

        setIsProcessing(true);
        try {
            const createSchedule = selectedItems.map(item => {
                return {
                    courtScheduleId: item.courtScheduleId,
                    paymentMethodId: paymentMethod,
                    scheduledAt: item.scheduleDate,
                    totalValue: totalAmount,
                    cartItemId: item.cartItemId
                };
            });
            await scheduleService.create(createSchedule);
        } catch (error) {
            showToast("Erro ao processar pagamento", "error");
            console.error("Erro ao processar pagamento:", error);
        } finally {
            setIsProcessing(false);
            onConfirmPayment();
        }
    }, [onConfirmPayment, paymentMethod, showToast, selectedItems, totalAmount]);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const formattedTotal = useMemo(() => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(totalAmount)
    }, [totalAmount]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Pagamento</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    <Typography>
                        Você está prestes a pagar pelos agendamentos selecionados.
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', mt: 1 }}>
                        Valor Total: {formattedTotal}
                    </Typography>
                </DialogContentText>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">Forma de Pagamento</InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method-select"
                        value={paymentMethod}
                        label="Forma de Pagamento"
                        onChange={event => setPaymentMethod(event.target.value as number)}
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