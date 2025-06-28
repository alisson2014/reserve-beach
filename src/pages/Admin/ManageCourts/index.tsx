import { JSX, useState, useCallback } from "react";
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
import { BasePaper } from "../../../components";
import { Court } from "../../../types/court";
import { getStatusChipColorFunction, handleCheckboxClickFunction, handleClickFunction, isSelectedFunction } from "./types";
import { MobileCard } from "./components";

const mockData: Court[] = [
    { id: 1, name: 'Quadra de Areia 1', date: '25/06/2025', time: '18:00 - 19:00', schedulingFee: 'R$ 60,00', active: true },
    { id: 2, name: 'Quadra Poliesportiva A', date: '25/06/2025', time: '19:00 - 20:00', schedulingFee: 'R$ 80,00', active: false },
    { id: 3, name: 'Quadra de Tênis', date: '26/06/2025', time: '09:00 - 10:00', schedulingFee: 'R$ 75,00', active: true },
    { id: 4, name: 'Quadra de Areia 2', date: '26/06/2025', time: '10:00 - 11:00', schedulingFee: 'R$ 60,00', active: false },
    { id: 5, name: 'Quadra Poliesportiva B', date: '27/06/2025', time: '20:00 - 21:00', schedulingFee: 'R$ 80,00', active: false },
];

const getStatusChipColor: getStatusChipColorFunction = active => active ? 'success' : 'error';

export function ManageCourts(): JSX.Element {
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            const newSelecteds = mockData.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const handleClick: handleClickFunction = useCallback(event => setAnchorEl(event.currentTarget), []);

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
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-end', sm: 'initial' } }}> 
                    <Button 
                        variant="contained" 
                        startIcon={<CancelIcon />}
                        color="error"
                        title="Realizar desativação das quadras selecionadas"
                        disabled={selected.length === 0}
                    >
                        Desativar ({selected.length})
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
                    {mockData.map(row => (
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
                                        indeterminate={selected.length > 0 && selected.length < mockData.length}
                                        checked={mockData.length > 0 && selected.length === mockData.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Preço</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockData.map((row) => {
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
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.time}</TableCell>
                                        <TableCell>{row.schedulingFee}</TableCell>
                                        <TableCell align="center">
                                            <Chip label={row.active ? 'Ativo' : 'Inativo'} color={getStatusChipColor(row.active)} size="small"/>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={e => handleClick(e)}>
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
                <MenuItem onClick={handleClose}>Editar</MenuItem>
                <MenuItem onClick={handleClose}>Apagar</MenuItem>
            </Menu>
        </BasePaper>
    );
};