import { useCallback, useEffect, useState } from "react";
import { ScheduleService } from "../../service";
import { ScheduleInfo } from "../../service/ScheduleService";
import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";

const scheduleService = ScheduleService.getInstance();

export default function Schedules() {
    const [schedulesInfo, setSchedulesInfo] = useState<ScheduleInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
 
    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const schedules = await scheduleService.info(); // 
            setSchedulesInfo(schedules); // 
            setError(null);
        } catch (error) {
            console.error('Error fetching schedules:', error); // 
            setError('Falha ao buscar os agendamentos.');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4, mt: { xs: 7, sm: 8 } }}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Agendamentos
                </Typography>
                <Grid container spacing={2}>
                    {schedulesInfo.map((schedule, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {schedule.courtName}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {schedule.scheduledAt ? `Agendado em: ${new Date(schedule.scheduledAt).toLocaleDateString('pt-BR')}` : 'Não agendado'}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Taxa: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(schedule.schedulingFee)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Início: {schedule.startTime}
                                    </Typography>
                                    <Typography variant="body2">
                                        Fim: {schedule.endTime}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};