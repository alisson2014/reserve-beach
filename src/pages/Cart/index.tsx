import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { BasePaper, PaymentDialog } from "../../components";
import { formatTime } from "../CourtScheduling/service";
import dayjs from "dayjs";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CartInformation } from "../../service/CartService/types";
import { CartService } from "../../service";
import { useAuth } from "../../contexts";

const cartService = CartService.getInstance();

export default function Cart(): JSX.Element {
    const { isAuthenticated } = useAuth();

    const [cartInfo, setCartInfo] = useState<readonly CartInformation[]>([]);
    const [selected, setSelected] = useState<readonly number[]>([]);

    const [isPaymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);

    const fetchCartInfo = useCallback(async (): Promise<void> => {
        try {
            const data = await cartService.getCartInfo();
            setCartInfo(data);
        } catch (error) {
            console.error("Erro ao buscar itens do carrinho:", error);
        }
    }, []);

    const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            const newSelecteds = cartInfo.map(n => n.cartItemId);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, [cartInfo]);

    const handleCheckboxClick = useCallback((_event: React.MouseEvent<unknown>, id: number): void => {
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

    const handleDeleteItem = useCallback(async () => {
        // Implementar a lógica para remover itens do carrinho
        try {
            await cartService.deleteItens(selected);
            setSelected([]);
            fetchCartInfo();
        } catch (error) {
            console.error("Erro ao remover itens do carrinho:", error);
        }
    }, [selected, fetchCartInfo]);

    const handleProcessPayment = useCallback(() => {
        setPaymentDialogOpen(true);
    }, []);

    const onConfirmPayment = useCallback(async () => {
        setPaymentDialogOpen(false);
        setSelected([]);
        fetchCartInfo(); 
    }, [fetchCartInfo]);

    const isSelected = useCallback((id: number): boolean => selected.indexOf(id) !== -1, [selected]);

    useEffect(() => {
        fetchCartInfo();
    }, [fetchCartInfo]);

    const totalAmount = useMemo(() => {
        const selectedItems = cartInfo.filter(item => selected.includes(item.cartItemId));
        return selectedItems.reduce((sum, item) => sum + item.schedulingFee, 0);
    }, [cartInfo, selected]);

    const ListItems = () => {
        const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

        if(isMobile) {
            // return (
            //     <Box>
            //         {/* {items.map(row => (
            //             <MobileCard 
            //                 isSelected={isSelected}
            //                 handleCheckboxClick={handleCheckboxClick}
            //                 row={row}
            //                 handleMoreOptions={handleMoreOptions}
            //                 getStatusChipColor={getStatusChipColor}
            //             />
            //         ))} */}
            //     </Box>
            // );
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
                                        indeterminate={selected.length > 0 && selected.length < cartInfo.length}
                                        checked={cartInfo.length > 0 && selected.length === cartInfo.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Quadra</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartInfo.length > 0 && cartInfo.map(row => {
                                const isItemSelected = isSelected(row.cartItemId);
                                return (
                                    <TableRow key={row.cartItemId} hover selected={isItemSelected}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                onClick={(event) => handleCheckboxClick(event, row.cartItemId)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.courtName}</TableCell>
                                        <TableCell>{dayjs(row.scheduleDate).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell>{formatTime(row.startTime)} - {formatTime(row.endTime)}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.schedulingFee)}
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

    if (!isAuthenticated) {
        return (
            <Container sx={{ py: 4, mt: { xs: 7, sm: 8 } }}>
                <BasePaper>
                    <Typography variant="h5" component="p" gutterBottom>
                        Você precisa estar logado para acessar o carrinho de agendamentos.
                    </Typography>
                </BasePaper>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, mt: { xs: 7, sm: 8 } }}>
            <BasePaper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: { xs: 2, sm: 0 } }}>
                        Carrinho de Agendamentos
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            color="error"
                            title="Remover quadras selecionadas do carrinho"
                            disabled={selected.length === 0}
                            onClick={handleDeleteItem}
                        >
                            Remover
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CheckCircleOutlineIcon />}
                            color="success"
                            title="Pagar quadras selecionadas"
                            disabled={selected.length === 0}
                            onClick={handleProcessPayment}
                        >
                            Pagar
                        </Button>
                    </Box>
                </Box>
                <ListItems />
            </BasePaper>

            <PaymentDialog 
                open={isPaymentDialogOpen}
                onClose={() => setPaymentDialogOpen(false)}
                totalAmount={totalAmount}
                onConfirmPayment={onConfirmPayment}
                selectedItems={cartInfo.filter(item => selected.includes(item.cartItemId))}
            />
        </Container>
    );
};