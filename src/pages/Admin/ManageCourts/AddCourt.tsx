import { JSX, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Typography,
    InputAdornment,
    Modal
} from "@mui/material";
import { Add as AddIcon } from '@mui/icons-material';
import { BasePaper } from "../../../components";
import { ICourtForm } from "./types";
import { CourtService } from "../../../service";
import { schema } from "./service";
import { CourtScheduleService } from "../../../service/CourtScheduleService";

const courtService = CourtService.getInstance();
const courtScheduleService = CourtScheduleService.getInstance();

const weekdayMap: { [key: string]: number } = {
    "Domingo": 0,
    "Segunda": 1,
    "Terça": 2,
    "Quarta": 3,
    "Quinta": 4,
    "Sexta": 5,
    "Sábado": 6
};
const weekdays = Object.keys(weekdayMap);
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00 - ${String(i).padStart(2, '0')}:59`);

export default function AddCourt(): JSX.Element {
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ICourtForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            schedulingFee: 0,
            capacity: 0,
            imageUrl: '',
            weekdays: [],
            hours: []
        }
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalImageUrl, setModalImageUrl] = useState<string>('');
    const imageUrlValue = watch('imageUrl');

    const handleConfirmImage = () => {
        setValue('imageUrl', modalImageUrl, { shouldValidate: true });
        setIsModalOpen(false);
    };

    const onSubmit: SubmitHandler<ICourtForm> = async data => {
        const courtCreate = {
            name: data.name,
            description: data.description,
            schedulingFee: data.schedulingFee,
            capacity: data.capacity,
            imageUrl: data.imageUrl
        };

        try {
            const { id: courtId } = await courtService.create(courtCreate);

            const courtScheduling = data.weekdays.flatMap(weekdayString =>
                data.hours.map(hourRange => { 
                    const [startTime, endTime] = hourRange.split(' - '); 

                    return {
                        startTime: startTime + ':00',
                        endTime: endTime + ':59', 
                        dayOfWeek: weekdayMap[weekdayString],
                        courtId
                    };
                })
            );
            courtScheduleService.create(courtScheduling)

            console.log("Quadra e horários salvos com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar quadra e horários:", error);
        }
    };

    return (
        <BasePaper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoComplete="off"
                                    label="Nome da Quadra"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                            name="schedulingFee"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Preço do Agendamento"
                                    variant="outlined"
                                    type="number"
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        },
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                    fullWidth
                                    error={!!errors.schedulingFee}
                                    helperText={errors.schedulingFee?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                            name="capacity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Capacidade"
                                    variant="outlined"
                                    type="number"
                                    slotProps={{
                                        htmlInput: {
                                            min: 1
                                        }
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                    fullWidth
                                    error={!!errors.capacity}
                                    helperText={errors.capacity?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" gutterBottom>Imagem da Quadra</Typography>
                        <Box
                            onClick={() => {
                                setModalImageUrl(imageUrlValue || '');
                                setIsModalOpen(true);
                            }}
                            sx={{
                                width: 150,
                                height: 150,
                                border: '2px dashed',
                                borderColor: errors.imageUrl ? 'error.main' : 'grey.500',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backgroundColor: 'grey.100',
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'grey.200',
                                }
                            }}
                        >
                            {imageUrlValue ? (
                                <img src={imageUrlValue} alt="Pré-visualização da Quadra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <AddIcon color="action" sx={{ fontSize: 40 }} />
                            )}
                        </Box>
                        {errors.imageUrl && <Typography color="error.main" variant="caption">{errors.imageUrl.message}</Typography>}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Descrição (opcional)"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">Dias da Semana Disponíveis</Typography>
                        <FormGroup row>
                            <Controller
                                name="weekdays"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        {weekdays.map(day => (
                                            <FormControlLabel
                                                key={day}
                                                control={<Checkbox
                                                    checked={field.value.includes(day)}
                                                    onChange={e => {
                                                        const newDays = e.target.checked
                                                            ? [...field.value, day]
                                                            : field.value.filter(d => d !== day);
                                                        field.onChange(newDays);
                                                    }}
                                                />}
                                                label={day}
                                            />
                                        ))}
                                    </>
                                )}
                            />
                        </FormGroup>
                        {errors.weekdays && <Typography color="error.main" variant="caption">{errors.weekdays.message}</Typography>}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">Horários Disponíveis</Typography>
                        <FormGroup>
                            <Controller
                                name="hours"
                                control={control}
                                render={({ field }) => (
                                    <Grid container spacing={1}>
                                        {hours.map(hour => (
                                            <Grid size={{ xs: 12, sm: 8, md: 3 }} key={hour}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={field.value.includes(hour)}
                                                        onChange={e => {
                                                            const newHours = e.target.checked
                                                                ? [...field.value, hour]
                                                                : field.value.filter(h => h !== hour);
                                                            field.onChange(newHours);
                                                        }}
                                                    />}
                                                    label={hour}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            />
                        </FormGroup>
                        {errors.hours && <Typography color="error.main" variant="caption">{errors.hours.message}</Typography>}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                            <Button type="submit" variant="contained" color="primary">
                                Salvar Quadra
                            </Button>
                            <Button variant="outlined" color="secondary">
                                Cancelar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="court-image-modal-title"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="court-image-modal" variant="h6" component="h2">
                        URL da Imagem
                    </Typography>
                    <TextField
                        fullWidth
                        label="Cole a URL da imagem aqui"
                        variant="outlined"
                        value={modalImageUrl}
                        onChange={(e) => setModalImageUrl(e.target.value)}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                         <Button onClick={() => setIsModalOpen(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmImage} variant="contained">
                            Confirmar
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </BasePaper>
    );
}