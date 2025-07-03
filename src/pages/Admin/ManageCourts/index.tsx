import { JSX, useState, useEffect, useCallback, useMemo } from "react";
import { 
    Box, 
    Button, 
    Menu,
    MenuItem,
    Fab,
    CircularProgress,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { BasePaper, ConfirmDialog, SearchField } from "../../../components";
import { Court } from "../../../types/court";
import { handleCheckboxClickFunction, handleMoreOptionsFunction, isSelectedFunction } from "./types";
import { CourtService } from "../../../service";
import { getStatusChipColor } from "./service";
import { useNavigate } from "react-router-dom";
import ListCourts from "./components/List";

const courtService = CourtService.getInstance();

export default function ManageCourts(): JSX.Element {
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [courts, setCourts] = useState<readonly Court[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCloseDialog = useCallback((): void => {
        setOpenDialog(false);
    }, []);

    const navigate = useNavigate();

    const isSelected: isSelectedFunction = useCallback(id => selected.indexOf(id) !== -1, [selected]);
    const selectedCourts = useMemo(() => courts.filter(court => selected.includes(court.id)), [courts, selected]);
    const activeSelected = useMemo(() => selectedCourts.filter(court => court.active), [selectedCourts]);
    const inactiveSelected = useMemo(() => selectedCourts.filter(court => !court.active), [selectedCourts]);

    const handleClose = useCallback((): void => {
        console.log('Menu closed');
        setAnchorEl(null)
    }, []);

    const fetchCourts = useCallback(async () => {
        try {
            setIsLoading(true);
            const [courts] = await Promise.all([
                courtService.all(searchTerm),
                new Promise(resolve => setTimeout(resolve, 1000)) 
            ]);
            setCourts(courts);
        } catch (error) {
            console.error('Erro ao buscar quadras:', error);
        } finally {
            setIsLoading(false);
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
        navigate(`/admin/courts/${openedMenuId}/edit`);
    }, [openedMenuId, navigate]);

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

    const handleMoreOptions: handleMoreOptionsFunction = useCallback((event, id) => {
        console.log('Menu opened for court ID:', event.currentTarget);
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

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <ListCourts 
                        courts={courts}
                        isSelected={isSelected}
                        handleCheckboxClick={handleCheckboxClick}
                        handleMoreOptions={handleMoreOptions}
                        getStatusChipColor={getStatusChipColor}
                        handleSelectAllClick={handleSelectAllClick}
                        selected={selected}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        keepMounted={false}
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
                </>
            )}

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