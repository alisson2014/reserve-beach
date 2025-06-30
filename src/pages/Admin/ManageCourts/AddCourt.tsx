import { JSX, useCallback, useState, useEffect, useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { BasePaper } from "../../../components";
import { ICourtForm } from "./types";
import { CourtService } from "../../../service";
import { defaultValues, hours, schema, weekdayMap, weekdays } from "./service";
import { CourtScheduleService } from "../../../service/CourtScheduleService";
import { useToast } from "../../../contexts";

const courtService = CourtService.getInstance();
const courtScheduleService = CourtScheduleService.getInstance();

export default function AddCourt(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const isEditMode = useMemo(() => !!id, [id]);

    const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ICourtForm>({
        resolver: yupResolver(schema),
        defaultValues
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalImageUrl, setModalImageUrl] = useState<string>('');
    const imageUrlValue = watch('imageUrl');

    const navigate = useNavigate();
    const { showToast, closeToast } = useToast();

    const handleConfirmImage = useCallback((): void => {
        setValue('imageUrl', modalImageUrl, { shouldValidate: true });
        setIsModalOpen(false);
    }, [modalImageUrl, setValue]);

    const onSubmit: SubmitHandler<ICourtForm> = async data => {
        if (isEditMode) {
            const courtUpdate = {
                name: data.name,
                description: data.description,
                schedulingFee: data.schedulingFee,
                capacity: data.capacity,
                imageUrl: data.imageUrl
            };

            try {
                const idNumber = Number(id);
                await courtService.update(idNumber, courtUpdate);

                const courtScheduling = data.weekdays.flatMap(weekdayString =>
                    data.hours.map(hourRange => {
                        const [startTime, endTime] = hourRange.split(' - ');
                        return {
                            startTime: startTime + ':00',
                            endTime: endTime + ':59',
                            dayOfWeek: weekdayMap[weekdayString],
                            courtId: idNumber
                        };
                    })
                );

                await Promise.all([
                    courtScheduleService.deleteByCourtId(idNumber),
                    courtScheduleService.create(courtScheduling)
                ]);

                showToast("Quadra atualizada com sucesso!", "success");
                setTimeout(() => {
                    closeToast();
                    navigate("/admin/courts");
                }, 1000);

            } catch (error) {
                console.error("Erro ao atualizar a quadra:", error);
                showToast("Erro ao atualizar a quadra.", "error");
            }

        } else {
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

                courtScheduleService.create(courtScheduling);

                showToast("Quadra criada com sucesso!", "success");
                setTimeout(() => {
                    closeToast();
                    navigate("/admin/courts");
                }, 1000);
            } catch (error) {
                console.error("Erro ao salvar quadra e horários:", error);
                showToast(error instanceof Error ? error.message : "Erro ao realizar cadastro", "error");
            }
        }
    };

    const loadCourtData = useCallback(async () => {
        try {
            const courtData = await courtService.show(Number(id));
            const schedules = courtData.schedules || [];

            const reverseWeekdayMap: { [key: number]: string } = {};
            Object.entries(weekdayMap).forEach(([name, num]) => {
                reverseWeekdayMap[num] = name;
            });

            const formattedData = {
                name: courtData.name,
                description: courtData.description ?? undefined,
                schedulingFee: courtData.schedulingFee,
                capacity: courtData.capacity,
                imageUrl: courtData.imageUrl ?? undefined,
                weekdays: [...new Set(schedules.map(s => reverseWeekdayMap[s.dayOfWeek]))],
                hours: [...new Set(schedules.map(s => `${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`))]
            };

            console.log("Dados da quadra formatados:", formattedData);
            reset(formattedData);
            setModalImageUrl(formattedData.imageUrl || '');

        } catch (error) {
            console.error("Erro ao carregar dados da quadra:", error);
            showToast("Falha ao carregar os dados da quadra.", "error");
            navigate('/admin/courts');
        }
    }, [id, reset, navigate, showToast]);

    useEffect(() => {
        if (!isEditMode) return;
        loadCourtData();
    }, [loadCourtData, isEditMode]); 

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
                                            min: 0
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
                            <Button 
                                variant="outlined" 
                                color="error"
                                title="Cancelar e voltar"
                                aria-label="Cancelar e voltar"
                                onClick={() => navigate(-1)}
                            >
                                <CancelIcon sx={{ mr: 1 }} />
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="success"
                                title="Salvar quadra e horários"
                                aria-label="Salvar quadra e horários"
                            >
                                <SaveIcon sx={{ mr: 1 }} />
                                Salvar
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