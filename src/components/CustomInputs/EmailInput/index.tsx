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
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Insira um email válido."
                    }
                })}
                value={emailValue}
                autoComplete="off"
                endAdornment={
                    <InputAdornment position="start">
                        <EmailIcon />
                    </InputAdornment>
                }
            />
            {errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
            )}
        </FormControl>  
    );
};