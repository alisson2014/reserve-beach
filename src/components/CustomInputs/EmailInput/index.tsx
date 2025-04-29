import { JSX } from "react";
import { EmailInputProps } from "./types";
import EmailIcon from '@mui/icons-material/Email';
import { FormControl, InputAdornment } from "@mui/material";
import { StyledInput, StyledInputLabel } from "../styles";

const EMAIL_ID = "standard-adornment-email";

export default function EmailInput({ emailValue, setEmailValue }: EmailInputProps): JSX.Element {
    return (
        <FormControl variant="standard">
            <StyledInputLabel htmlFor={EMAIL_ID}>Email</StyledInputLabel>
            <StyledInput
                id={EMAIL_ID}
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                type="email"
                endAdornment={
                    <InputAdornment position="start">
                        <EmailIcon />
                    </InputAdornment>
                }
            />
        </FormControl>  
    );
};