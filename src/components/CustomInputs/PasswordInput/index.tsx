import { useState, JSX } from "react";
import { PasswordInputProps } from "./types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment } from "@mui/material";
import { StyledInput, StyledInputLabel } from "../styles";

export default function PasswordInput({ 
    label = "Senha", 
    passwordValue, 
    setPasswordValue, 
    passwordId = "standard-adornment-password" 
}: PasswordInputProps): JSX.Element {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword(show => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    return (
        <FormControl variant="standard">
            <StyledInputLabel htmlFor={passwordId}>{label}</StyledInputLabel>
            <StyledInput
                id={passwordId}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            title={showPassword ? 'Esconder a senha' : 'Mostrar a senha'}
                            aria-label={showPassword ? 'Esconder a senha' : 'Mostrar a senha'}
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>  
    );
};