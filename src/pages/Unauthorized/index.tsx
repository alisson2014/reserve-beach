import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function Unauthorized(): JSX.Element {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(-1);
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h2">Acesso Negado</Typography>
            <Typography variant="subtitle1">Você não tem permissão para visualizar esta página.</Typography>
        </Box>
    );
};