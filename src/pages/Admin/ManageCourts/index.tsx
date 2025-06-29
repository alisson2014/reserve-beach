import { JSX, useState, useEffect, useCallback, useMemo } from "react";
import { 
    Box, 
    Button, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    Fab,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { BasePaper, ConfirmDialog, SearchField } from "../../../components";
import { Court } from "../../../types/court";
import { handleCheckboxClickFunction, handleMoreOptionsFunction, isSelectedFunction } from "./types";
import { MobileCard } from "./components";
import { CourtService } from "../../../service";
import { getStatusChipColor } from "./service";
import { useNavigate } from "react-router-dom";

const courtService = CourtService.getInstance();

export default function ManageCourts(): JSX.Element {
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [courts, setCourts] = useState<readonly Court[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleCloseDialog = useCallback((): void => {
        setOpenDialog(false);
    }, []);

    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const isSelected: isSelectedFunction = useCallback(id => selected.indexOf(id) !== -1, [selected]);
    const selectedCourts = useMemo(() => courts.filter(court => selected.includes(court.id)), [courts, selected]);
    const activeSelected = useMemo(() => selectedCourts.filter(court => court.active), [selectedCourts]);
    const inactiveSelected = useMemo(() => selectedCourts.filter(court => !court.active), [selectedCourts]);

    const handleClose = useCallback((): void => setAnchorEl(null), []);

    const fetchCourts = useCallback(async () => {
        try {
            const courts = await courtService.findAll(searchTerm);
            setCourts(courts);
        } catch (error) {
            console.error('Erro ao buscar quadras:', error);
        }
    }, [searchTerm]);

    const setActive = useCallback(async (ids: number[], active: boolean): Promise<void> => {
        try {
            await courtService.setActive(ids, active);
        } catch (error) {
            console.error('Erro ao atualizar quadras:', error);
        } finally {
            setSelected(selected => selected.filter(item => !ids.includes(item)))
            await fetchCourts();
        }
    }, [fetchCourts]);

    const handleDelete = useCallback(async () => {
        if (openedMenuId === null) return;

        try {
            await courtService.delete(openedMenuId);
        } catch (error) {
            console.error('Erro ao excluir quadra:', error);
        } finally {
            setSelected(selected => selected.filter(item => item !== openedMenuId));
            await fetchCourts();
            handleCloseDialog();
            handleClose();
        }
    }, [fetchCourts, handleClose, handleCloseDialog, openedMenuId]);

    const handleEdit = useCallback(() => {
        if (openedMenuId === null) return;
        console.log(`Editar quadra ${openedMenuId}`);
        // Implementar lógica de edição aqui
    }, [openedMenuId]);

    const handleAdd = useCallback(() => {
        navigate('/admin/courts/add');
    }, [navigate]);

    const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            const newSelecteds = courts.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, [courts]);

    const handleMoreOptions: handleMoreOptionsFunction = useCallback(async (event, id) => {
        setAnchorEl(event.currentTarget);
        setOpenedMenuId(id);
    }, []);

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
                <SearchField 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-end', sm: 'initial' }, flexDirection: { xs: 'column', sm: 'row' } }}> 
                    <Button 
                        variant="outlined" 
                        startIcon={<CancelIcon />}
                        color="error"
                        title="Realizar desativação das quadras selecionadas"
                        onClick={() => setActive(activeSelected.map(c => c.id), false)}
                        disabled={activeSelected.length === 0}
                    >
                        Desativar ({activeSelected.length})
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<CheckCircleOutlineIcon />}
                        color="success"
                        title="Realizar ativação das quadras selecionadas"
                        onClick={() => setActive(inactiveSelected.map(c => c.id), true)}
                        disabled={inactiveSelected.length === 0}
                    >
                        Ativar ({inactiveSelected.length})
                    </Button>
                    <Fab 
                        variant="extended"
                        title="Adicionar nova quadra"
                        onClick={handleAdd}
                    >
                        <AddIcon sx={{ mr: 1 }} />
                        Adicionar
                    </Fab>
                </Box>
            </Box>

            {isMobile ? (
                <Box>
                    {courts.map(row => (
                        <MobileCard 
                            isSelected={isSelected}
                            handleCheckboxClick={handleCheckboxClick}
                            row={row}
                            handleMoreOptions={handleMoreOptions}
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
                                    <TableRow key={row.id} hover onDoubleClick={handleEdit} selected={isItemSelected}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                onClick={(event) => handleCheckboxClick(event, row.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.capacity}</TableCell>
                                        <TableCell>{row.description ?? "Sem descrição"}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.schedulingFee)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={row.active ? 'Ativo' : 'Inativo'} color={getStatusChipColor(row.active)} size="small"/>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={e => handleMoreOptions(e, row.id)} title="Mais ações">
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
                <MenuItem onClick={handleEdit} title="Ir para edição da quadra">
                    <ModeEditOutlineIcon fontSize="small" />
                    &ensp;Editar
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        handleClose();
                        setOpenDialog(true);
                    }} 
                    title="Excluir a quadra selecionada"
                >
                    <DeleteIcon fontSize="small" />
                    &ensp;Apagar
                </MenuItem>
            </Menu>

            <ConfirmDialog 
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                dialogTitle="Deseja realmente excluir a quadra selecionada?"
                handleDisagree={handleCloseDialog}
                handleAgree={handleDelete}
            />
        </BasePaper>
    );
};