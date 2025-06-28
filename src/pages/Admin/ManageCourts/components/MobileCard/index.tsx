import { Box, Checkbox, Chip, IconButton, Paper, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MobileCardProps } from "./types";

export default function MobileCard({ isSelected, handleCheckboxClick, row, handleMoreOptions, getStatusChipColor }: MobileCardProps) {
    return (
        <Paper key={row.id} sx={{ p: 2, mb: 2, '&:last-child': { mb: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox
                        color="primary"
                        checked={isSelected(row.id)}
                        onClick={(event) => handleCheckboxClick(event, row.id)}
                    />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {row.name}
                    </Typography>
                </Box>
                <IconButton
                    aria-label="more"
                    onClick={e => handleMoreOptions(e, row.id)}
                >
                    <MoreVertIcon />
                </IconButton>
            </Box>
            <Box sx={{ pl: '42px', pt: 1 }}> 
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">Capacidade:</Typography>
                    <Typography variant="body2">{row.capacity}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">Descrição:</Typography>
                    <Typography variant="body2">{row.description ?? "Sem descrição"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Preço:</Typography>
                    <Typography variant="body2">{row.schedulingFee}</Typography>
                </Box>
                <Chip 
                    label={row.active ? 'Ativo' : 'Inativo'}
                    color={getStatusChipColor(row.active)}
                    size="small"
                />
            </Box>
        </Paper>
    );
};