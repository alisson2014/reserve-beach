import { useState, JSX, useMemo } from "react";
import { PasswordInputProps } from "./types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, FormHelperText } from "@mui/material";
import { StyledInput, StyledInputLabel } from "../styles";

export default function PasswordInput({ 
    passwordValue, 
    register,
    errors,
    label = "Senha", 
    passwordId = "standard-adornment-password",
    isRegister = false
}: PasswordInputProps): JSX.Element {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword(show => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const passwordProps = useMemo(() => {
        const props = {
            required: "O campo de senha é obrigatório."
        };

        if(!isRegister) {
            return props;
        }

        return {
            ...props, 
            minLength: {
                value: 8,
                message: "A senha deve ter no mínimo 8 caracteres."
            }
        };
    }, [isRegister]);

    return (
        <FormControl variant="standard" error={!!errors.password}>
            <StyledInputLabel htmlFor={passwordId}>{label}</StyledInputLabel>
            <StyledInput
                id={passwordId}
                {...register("password", passwordProps)}
                value={passwordValue}
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
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
            {errors.password && (
                <FormHelperText>{errors.password.message}</FormHelperText>
            )}
        </FormControl>  
    );
};