import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function Unauthorized(): JSX.Element {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h2">Acesso Negado</Typography>
            <Typography variant="subtitle1">Você não tem permissão para visualizar esta página.</Typography>
            <Link to="/" title="Voltar para o inicio">Voltar para o Inicio</Link>
        </Box>
    );
};