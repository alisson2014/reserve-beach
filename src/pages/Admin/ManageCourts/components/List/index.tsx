import { 
    Box, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Checkbox,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { JSX } from "react";
import { Court } from "../../../../../types/court";
import { getStatusChipColorFunction, handleCheckboxClickFunction, handleMoreOptionsFunction, isSelectedFunction } from "../../types";
import MobileCard from "../MobileCard";

interface CourtListProps {
    courts: readonly Court[];
    isSelected: isSelectedFunction;
    handleCheckboxClick: handleCheckboxClickFunction;
    handleMoreOptions: handleMoreOptionsFunction;
    getStatusChipColor: getStatusChipColorFunction;
    handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selected: readonly number[];
};

export default function ListCourts({ 
    courts, 
    isSelected, 
    handleCheckboxClick, 
    handleMoreOptions, 
    getStatusChipColor,
    handleSelectAllClick,
    selected
}: CourtListProps): JSX.Element {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    if(isMobile) {
        return (
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
        );
    }

    return (
        <Box sx={{ overflow: 'auto', maxHeight: '460px' }}>
            <TableContainer>
                <Table aria-label="Tabela de quadras">
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
        </Box>
    );
};