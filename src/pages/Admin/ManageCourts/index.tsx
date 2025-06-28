import { JSX, useState, useEffect, useCallback } from "react";
import { 
    Box, 
    TextField, 
    Button, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputAdornment,
    Chip,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery, 
    useTheme 
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { BasePaper } from "../../../components";
import { Court } from "../../../types/court";
import { getStatusChipColorFunction, handleCheckboxClickFunction, handleClickFunction, isSelectedFunction } from "./types";
import { MobileCard } from "./components";
import { CourtService } from "../../../service";

const getStatusChipColor: getStatusChipColorFunction = active => active ? 'success' : 'error';

export function ManageCourts(): JSX.Element {
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [courts, setCourts] = useState<readonly Court[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const courtService = CourtService.getInstance();

    const fetchCourts = useCallback(async () => {
        try {
            const courts = await courtService.findAll(searchTerm);
            setCourts(courts);
        } catch (error) {
            console.error('Erro ao buscar quadras:', error);
            // Aqui você pode adicionar lógica para lidar com erros, como exibir uma notificação
        }
    }, [courtService, searchTerm]);

    const setActive = useCallback(async (active: boolean) => {
        try {
            await courtService.setActive(selected, active);
            setSelected([]);
            await fetchCourts(); 
        } catch (error) {
            console.error('Erro ao desativar quadras:', error);
            // Aqui você pode adicionar lógica para lidar com erros, como exibir uma notificação
        }
    }, [courtService, selected, fetchCourts]);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await courtService.delete(id);
            setSelected(selected.filter(item => item !== id));
            await fetchCourts(); 
        } catch (error) {
            console.error('Erro ao excluir quadra:', error);
            // Aqui você pode adicionar lógica para lidar com erros, como exibir uma notificação
        }
    }, [courtService, fetchCourts, selected]);

    const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            const newSelecteds = courts.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, [courts]);

    const handleClick: handleClickFunction = useCallback(async (event, id) => {
        setAnchorEl(event.currentTarget);
        await handleDelete(id);
    }, [handleDelete]);

    const handleClose = useCallback((): void => setAnchorEl(null), []);

    const handleCheckboxClick: handleCheckboxClickFunction = useCallback((_event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    }, [selected]);

    const isSelected: isSelectedFunction = useCallback(id => selected.indexOf(id) !== -1, [selected]);

    useEffect(() => {
        fetchCourts();
    }, [fetchCourts]);

    return (
        <BasePaper>
            <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
                mb: 3 
            }}>
                <TextField
                    label="Buscar pelo nome"
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1, maxWidth: { sm: '400px' } }} 
                    InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment> }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-end', sm: 'initial' }, flexDirection: { xs: 'column', sm: 'row' } }}> 
                    <Button 
                        variant="contained" 
                        startIcon={<CancelIcon />}
                        color="error"
                        title="Realizar desativação das quadras selecionadas"
                        onClick={() => setActive(false)}
                        disabled={selected.length === 0}
                    >
                        Desativar ({selected.length})
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<PublishedWithChangesIcon />}
                        color="success"
                        title="Realizar ativação das quadras selecionadas"
                        onClick={() => setActive(true)}
                        disabled={selected.length === 0}
                    >
                        Ativar ({selected.length})
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        title="Adicionar nova quadra"
                    >
                        Adicionar
                    </Button>
                </Box>
            </Box>

            {isMobile ? (
                <Box>
                    {courts.map(row => (
                        <MobileCard 
                            isSelected={isSelected}
                            handleCheckboxClick={handleCheckboxClick}
                            row={row}
                            handleClick={handleClick}
                            getStatusChipColor={getStatusChipColor}
                        />
                    ))}
                </Box>
            ) : (
                <TableContainer>
                    <Table stickyHeader aria-label="Tabela de quadras">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < courts.length}
                                        checked={courts.length > 0 && selected.length === courts.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Capacidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Preço</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courts.map(row => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <TableRow key={row.id} hover selected={isItemSelected}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                onClick={(event) => handleCheckboxClick(event, row.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.capacity}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.schedulingFee)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={row.active ? 'Ativo' : 'Inativo'} color={getStatusChipColor(row.active)} size="small"/>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={e => handleClick(e, row.id)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} title="Ir para edição da quadra" sx={{ color: 'primary.main' }}>
                    <ModeEditOutlineIcon fontSize="small" />
                    &ensp;Editar
                </MenuItem>
                <MenuItem onClick={handleClose} title="Excluir a quadra selecionada" sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" />
                    &ensp;Apagar
                </MenuItem>
            </Menu>
        </BasePaper>
    );
};