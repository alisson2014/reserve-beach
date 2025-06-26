import { JSX } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCard, PasswordInput, EmailInput, LoadingButton } from "../../components";
import LoginTemplate from "../LoginTemplate";
import { ILoginForm } from "../../types/forms";
import { CustomLink } from "./styles";
import { useAuth, useToast } from "../../contexts";

export default function Login(): JSX.Element {
    const { login } = useAuth();
    const { showToast } = useToast();

    const navigate = useNavigate(); 

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, watch } = useForm<ILoginForm>({
        mode: "onSubmit", 
    });

    const email = watch("email", ""); 
    const password = watch("password", ""); 

    const onSubmit: SubmitHandler<ILoginForm> = async () => {
        const loginPromise = login(email, password);

        const [loginResult] = await Promise.all([
            loginPromise,
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);

        const { message, user, status } = loginResult;

        if(!status) return;

        if(message) {
            showToast(message, "success");
        }
        
        if(user?.roles.includes("ROLE_ADMIN") || user?.roles.includes("ROLE_SUPER_ADMIN")) {
            navigate("/admin");
        } else {
            navigate("/");
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

                <LoadingButton
                    variant="contained"
                    aria-label="Realizar login com as credenciais"
                    title="Realizar login com as credenciais"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isValid}
                >
                    Logar
                </LoadingButton>

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