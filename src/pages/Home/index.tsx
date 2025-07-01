import { JSX, useCallback, useEffect, useState } from "react";
import { Grid, Box, Typography, Container, Button } from '@mui/material';
import { Court } from "../../types/court";
import CourtCard from "./components/CourtCard";
import { CourtService } from "../../service";

const courtService = CourtService.getInstance();
const CARDS_PER_PAGE = 6;

export default function Home(): JSX.Element {
    const [courtsData, setCourtsData] = useState<Court[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(CARDS_PER_PAGE);

    const fetchCourts = useCallback(async (): Promise<void> => {
        const courts = await courtService.all();
        setCourtsData(courts);
    }, []);

    const handleLoadMore = useCallback(() => {
        setVisibleCount(prevCount => prevCount + CARDS_PER_PAGE);
    }, []);

      const handleViewSchedules = (courtId: number) => {
        const selectedCourt = courtsData.find(c => c.id === courtId);
        // Aqui você implementaria a lógica de navegação ou de abrir um modal
        console.log(`Ver horários da quadra: ${selectedCourt?.name} (ID: ${courtId})`);
        alert(`Abrindo horários para a quadra: ${selectedCourt?.name}`);
    };

    useEffect(() => {
        fetchCourts();
    }, [fetchCourts]);

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Quadras Disponíveis
            </Typography>
            <Box>
                <Grid container spacing={4}>
                {courtsData.slice(0, visibleCount).map((court) => (
                    <Grid key={court.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <CourtCard court={court} onViewSchedules={handleViewSchedules} />
                    </Grid>
                ))}
                </Grid>
            </Box>
            {visibleCount < courtsData.length && (
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <Button variant="contained" onClick={handleLoadMore}>
                        Ver mais
                    </Button>
                </Box>
            )}
        </Container>
    );
};