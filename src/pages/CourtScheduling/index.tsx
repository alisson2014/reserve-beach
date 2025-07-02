import { JSX, useState, useEffect, useCallback, useMemo } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { useParams } from "react-router-dom";
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { Court } from "../../types/court";
import { CourtScheduleService, CourtService } from "../../service";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat); 

function groupSlots(slots: string[]): string[] {
    if (slots.length === 0) return [];

    const timeFormat = 'HH:mm';

    const sorted = [...slots].sort((a, b) => { 
        const [aStart] = a.split(' - ');
        const [bStart] = b.split(' - ');
        return dayjs(aStart, timeFormat).diff(dayjs(bStart, timeFormat));
    });

    const result: { start: string; end: string }[] = [];
    const [initialStart, initialEnd] = sorted[0].split(' - ').map(s => s.trim());
    let currentGroup = { start: initialStart, end: initialEnd };

    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i].split(' - ');
        const prevEnd = currentGroup.end;

        const expectedStart = dayjs(prevEnd, timeFormat).add(1, 'minute');

        if (dayjs(start, timeFormat).isSame(expectedStart)) {
            currentGroup.end = end; 
        } else {
            result.push(currentGroup);
            currentGroup = { start, end };
        }
    }
    result.push(currentGroup);

    return result.map(({ start, end }) => `${start} as ${end}`);
}

const courtService = CourtService.getInstance();
const courtScheduleService = CourtScheduleService.getInstance();

export default function CourtScheduling(): JSX.Element {
    const { id } = useParams<{ id: string }>();

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [courtInfo, setCourtInfo] = useState<Court>({} as Court);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const fetchCourtInfo = useCallback(async () => {
        if(!id) return; 

        try {
            const data = await courtService.show(Number(id));
            setCourtInfo(data);
        } catch (error) {
            console.error("Failed to fetch court information:", error);
        }
    }, [id]);

    const fetchSchedulesAndBookings = useCallback(async () => {
        if (!id || !selectedDate) return;

        try {
            const dayOfWeek = selectedDate.day(); 
            console.log(`Fetching schedules for court ID ${id} on day ${dayOfWeek} (${selectedDate.format('DD/MM/YYYY')})`);

            const schedules = await courtScheduleService.getByCourtAndDay(Number(id), dayOfWeek);
            const allPossibleSlots = schedules.map(s => `${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`);
            
            setAvailableSlots(allPossibleSlots);
        } catch (error) {
            console.error("Failed to fetch schedules and bookings:", error);
        }
    }, [id, selectedDate]);

    const handleSlotClick = useCallback((slot: string) => {
        setSelectedSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
        );
    }, []);

    useEffect(() => {
        fetchCourtInfo();
    }, [fetchCourtInfo]);

    useEffect(() => {
        fetchSchedulesAndBookings();
    }, [fetchSchedulesAndBookings]);

    const groupedSlots = useMemo(() => groupSlots(selectedSlots), [selectedSlots]);

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
                            onChange={newDate => setSelectedDate(newDate)}
                            format="DD/MM/YYYY" 
                        />
                    </Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Horários Disponíveis
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 2 }}>
                        {availableSlots.length > 0 ? availableSlots.map(slot => (
                            <Chip
                                key={slot}
                                label={slot}
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
                    >
                        Reservar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={selectedSlots.length === 0}
                    >
                        Pagar
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}