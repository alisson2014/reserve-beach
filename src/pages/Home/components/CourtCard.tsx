import { JSX } from 'react';
import { Card, CardContent, Typography, CardActions, Button, CardMedia } from '@mui/material';
import { Court } from '../../../types/court';

interface CourtCardProps {
  court: Court;
  onViewSchedules: (courtId: number) => void;
}

export default function CourtCard({ court, onViewSchedules }: CourtCardProps): JSX.Element {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {court.imageUrl ? (
        <CardMedia
          component="img"
          height="140"
          image={court.imageUrl}
          alt={`Imagem da ${court.name}`}
        />
      ) : (
        <CardMedia
          component="div"
          sx={{ height: 140, backgroundColor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography variant="h6" color="text.secondary">
            Sem imagem disponível
          </Typography>
        </CardMedia>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {court.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Capacidade:</b> {court.capacity} pessoa{court.capacity > 1 ? 's' : ''}
        </Typography>
        {court.description && (
            <Typography variant="body2" color="text.secondary">
            <b>Descrição:</b> {court.description}
            </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button 
          size="small" 
          title={`Ver horários da quadra ${court.name}`}
          aria-label={`Ver horários da quadra ${court.name}`}
          variant="contained" 
          onClick={() => onViewSchedules(court.id)}
        >
          Ver Horários
        </Button>
      </CardActions>
    </Card>
  );
};