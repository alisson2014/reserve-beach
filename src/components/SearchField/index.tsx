import { JSX } from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchField({ ...props }: TextFieldProps): JSX.Element {
    const endAdornment = (
        <InputAdornment position="end">
            <SearchIcon titleAccess="Ícone de busca" />
        </InputAdornment>
    );

    return (
        <TextField
            label="Buscar"
            aria-label="Campo de busca"
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, maxWidth: { sm: '400px' } }}
            type="search"
            autoComplete="off"
            slotProps={{
                input: {
                    endAdornment
                }
            }}
            {...props}
        />
    );
};