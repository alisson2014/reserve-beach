import { JSX } from "react";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField} from "@mui/material";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../../img/Logo.png"

export default function Login(): JSX.Element {
    return (
        <>
        <img className="logo" src={logo} alt="Logo" />
            <Box className = "login-container"
                
            >   <h1>Login</h1>
                <TextField className = "login-field" id="standard-basic" label="Email" variant="standard" />
                <TextField className = "login-field" id="standard-password-input" label="Senha" type="password" variant="standard" />
                <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Lembrar minha senha" />
                </FormGroup>
                <Link className = "login-link" to="">Esqueceu a senha ?</Link> 
                <Button className = "login-button">
                    Logar
                </Button>
                <Link className = "login-link" to="">Registrar-se</Link>
                
            </Box>
        </>
    )
}