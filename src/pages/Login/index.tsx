import { JSX } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCard, PasswordInput, EmailInput } from "../../components";
import LoginTemplate from "../LoginTemplate";
import { ILoginForm } from "../../types/forms";
import { CustomLink } from "./styles";
import { useAuth, useToast } from "../../contexts";

export default function Login(): JSX.Element {
    const { login } = useAuth();
    const { showToast } = useToast();

    const navigate = useNavigate(); 

    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<ILoginForm>({
        mode: "onSubmit", 
    });

    const email = watch("email", ""); 
    const password = watch("password", ""); 

    const onSubmit: SubmitHandler<ILoginForm> = async () => {
        try {
            const { message, user } = await login(email, password);

            if(message) {
                showToast(message, "success");
            }
            
            if(user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN")) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Erro ao realizar login", "error");
            console.error("Login failed", error);
        }
    };

    return (
        <LoginTemplate>
            <LoginCard onSubmit={handleSubmit(onSubmit)}>   
                <Typography variant="h4" component="h2" sx={{ textAlign: "center" }}>Login</Typography>
                
                <EmailInput 
                    emailValue={email} 
                    register={register} 
                    errors={errors} 
                />
                <PasswordInput 
                    passwordValue={password} 
                    register={register}
                    errors={errors}
                />

                <CustomLink 
                    title="Clique aqui para realizar a recuperação da senha" 
                    aria-label="Clique aqui para realizar a recuperação da senha"
                    to="/forgotPassword"
                >
                    Esqueceu a senha ?
                </CustomLink> 

                <Button 
                    variant="contained"
                    aria-label="Realizar login com as credenciais"
                    title="Realizar login com as credenciais"
                    type="submit"
                    disabled={!isValid}
                >
                    Logar
                </Button>

                <CustomLink
                    title="Clique aqui para se cadastrar no sistema" 
                    aria-label="Clique aqui para se cadastrar no sistema"
                    to="/register"
                >
                    Registrar-se
                </CustomLink>
            </LoginCard>
        </LoginTemplate>
    );
};