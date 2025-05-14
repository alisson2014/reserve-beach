import { JSX } from "react";
import { EmailInputProps } from "./types";
import EmailIcon from '@mui/icons-material/Email';
import { FormControl, InputAdornment, FormHelperText } from "@mui/material";
import { StyledInput, StyledInputLabel } from "../styles";

const EMAIL_ID = "standard-adornment-email";

export default function EmailInput({ emailValue, register, errors }: EmailInputProps): JSX.Element {
    return (
        <FormControl variant="standard" error={!!errors.email}>
            <StyledInputLabel htmlFor={EMAIL_ID}>Email</StyledInputLabel>
            <StyledInput
                id={EMAIL_ID}
                {...register("email", {
                    required: "O campo de email é obrigatório.",
                    minLength: {
                        value: 5,
                        message: "O email deve ter pelo menos 5 caracteres."
                    },
                    maxLength: {
                        value: 254,
                        message: "O email deve ter no máximo 254 caracteres."
                    },
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Insira um email válido."
                    }
                })}
                value={emailValue}
                autoComplete="off"
                endAdornment={
                    <InputAdornment position="start">
                        <EmailIcon sx={{ color: "white" }} titleAccess="Email icon" />
                    </InputAdornment>
                }
            />
            {errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
            )}
        </FormControl>  
    );
};