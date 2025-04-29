import { JSX, useState, useCallback } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoginCard from "../../components/LoginCard";
import LoginTemplate from "../LoginTemplate";
import { EmailInput, PasswordInput } from "../../components/CustomInputs";
import "./styles.css";

export default function Login(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onChangePassword = useCallback((e: string): void => setPassword(e), []);
    const setEmailValue = useCallback((e: string): void => setEmail(e), []);    

    return (
        <LoginTemplate>
            <LoginCard>   
                <Typography variant="h4" sx={{ textAlign: "center" }}>Login</Typography>

                <EmailInput emailValue={email} setEmailValue={setEmailValue} />
                <PasswordInput passwordValue={password} setPasswordValue={onChangePassword} />

                <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Lembrar minha senha" />
                </FormGroup>

                <Link className="login-link" to="/forgotPassword">Esqueceu a senha ?</Link> 
                <Button 
                    variant="contained"
                    title="Realizar login com as credenciais"
                >
                    Logar
                </Button>

                <Link className="login-link" to="/register">Registrar-se</Link>
            </LoginCard>
        </LoginTemplate>
    );
};