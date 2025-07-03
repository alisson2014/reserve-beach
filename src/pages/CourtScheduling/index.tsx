import { JSX, useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Court } from "../../types/court";
import { CourtScheduleService, CourtService, CartService, groupSlots } from "../../service";
import { CourtSchedule } from "../../types/court_schedule";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { formatTime } from "./service";
import { CartItemBody } from "../../service/CartService/types";
import { useAuth, useToast } from "../../contexts";

const courtService = CourtService.getInstance();
const courtScheduleService = CourtScheduleService.getInstance();
const cartService = CartService.getInstance();

export default function CourtScheduling(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [courtInfo, setCourtInfo] = useState<Court>({} as Court);
    const [availableSlots, setAvailableSlots] = useState<CourtSchedule[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<CourtSchedule[]>([]);

    const fetchCourtInfo = useCallback(async () => {
        if(!id) return; 

        try {
            const data = await courtService.show(Number(id));
            setCourtInfo(data);
        } catch (error) {
            console.error("Failed to fetch court information:", error);
        }
    }, [id]);

    const fetchSchedules = useCallback(async () => {
        if (!id || !selectedDate) return;

        try {
            const dayOfWeek = selectedDate.day(); 

            const schedules = await courtScheduleService.getByCourtAndDay(Number(id), dayOfWeek);
            
            setAvailableSlots(schedules);
        } catch (error) {
            console.error("Failed to fetch schedules and bookings:", error);
        }
    }, [id, selectedDate]);

    const handleSlotClick = useCallback((slot: CourtSchedule) => {
        setSelectedSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s.id !== slot.id) : [...prev, slot]
        );
    }, []);

    const handleScheduledDate = useCallback((newDate: PickerValue) => {
        setSelectedDate(newDate);
        setSelectedSlots([]);
    }, []);

    const handleAddToCart = useCallback(async () => {
        if (selectedSlots.length === 0 || !selectedDate) return;

        if(!isAuthenticated) {
            showToast("Você precisa estar logado para adicionar horários ao carrinho.", "warning");
            navigate("/login");
            return;
        }

        const body: CartItemBody = {
            courtScheduleIds: selectedSlots.map(slot => slot.id),
            scheduleDate: selectedDate?.format('YYYY-MM-DD')
        };

        try {
            await cartService.addItems(body);
            alert("Horários adicionados ao carrinho com sucesso!");
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Erro ao adicionar horários ao carrinho.");
        } finally {
            setSelectedSlots([]);
            setSelectedDate(dayjs());
        }
    }, [selectedSlots, selectedDate, isAuthenticated, showToast, navigate]);

    useEffect(() => {
        fetchCourtInfo();
    }, [fetchCourtInfo]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const groupedSlots = useMemo(() => {
        const selectedSlotTimes = selectedSlots.map(slot => `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`);
        return groupSlots(selectedSlotTimes);
    }, [selectedSlots]);

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, mt: { xs: 7, sm: 8 }, minHeight: '100vh' }}>
            <Grid container spacing={{ xs: 2, md: 1 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {courtInfo.name}
                        </Typography>
                        {courtInfo?.description && (
                            <Typography variant="body1" color="text.secondary">
                                {courtInfo.description}
                            </Typography>
                        )}
                        <Typography variant="h5" component="p" gutterBottom>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(courtInfo.schedulingFee || 0)} a hora 
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ideal para até {courtInfo.capacity} pessoas 
                        </Typography>
                        <Typography variant="h6" component="p">
                            Total de horas: {groupedSlots.length > 0 ? groupedSlots.join(', ') : '-'}
                        </Typography>
                        <Typography variant="h6" component="p">
                            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((courtInfo.schedulingFee || 0) * selectedSlots.length)}
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Box sx={{ mb: 3 }}>
                        <DatePicker
                            label="Data do agendamento"
                            value={selectedDate}
                            onChange={handleScheduledDate}
                            format="DD/MM/YYYY" 
                        />
                    </Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Horários Disponíveis
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 2 }}>
                        {availableSlots.length > 0 ? availableSlots.map(slot => (
                            <Chip
                                key={slot.id}
                                label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                                color={selectedSlots.includes(slot) ? 'success' : 'default'}
                                onClick={() => handleSlotClick(slot)}
                                clickable
                                sx={{ minWidth: 120, justifyContent: 'center' }}
                            />
                        )) : (
                            <Typography variant="body2" color="text.secondary">
                                Não há horários disponíveis para a data selecionada.
                            </Typography>
                        )}
                    </Box>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedSlots.length === 0}
                        onClick={handleAddToCart}
                        title="Adicionar horários selecionados ao carrinho"
                    >
                        <AddShoppingCartIcon sx={{ mr: 1 }} />
                        Adicionar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={selectedSlots.length === 0}
                        title="Finalizar agendamento e pagar"
                    >
                        <PaymentsIcon sx={{ mr: 1 }} />
                        Pagar
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}