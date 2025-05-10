import { JSX } from "react";
import { PersonInputProps } from "./types";
import PersonIcon from '@mui/icons-material/Person';
import { FormControl, InputAdornment, FormHelperText } from "@mui/material";
import { StyledInput, StyledInputLabel } from "../styles";

const PERSON_ID = "standard-adornment-person";

export default function PersonInput({ personValue, register, errors, label="Nome", name="name" }: PersonInputProps): JSX.Element {
    return (
        <FormControl variant="standard" error={!!errors.name}>
            <StyledInputLabel htmlFor={PERSON_ID}>{label}</StyledInputLabel>
            <StyledInput
                id={name}
                {...register(name, {
                    required: "O campo de nome é obrigatório.",
                    minLength: {
                        value: 5,
                        message: "O nome deve ter pelo menos 5 caracteres."
                    }
                })}
                value={personValue}
                autoComplete="off"
                endAdornment={
                    <InputAdornment position="start">
                        <PersonIcon sx={{ color: "white" }} titleAccess="Email icon" />
                    </InputAdornment>
                }
            />
            {errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
            )}
        </FormControl>  
    );
};