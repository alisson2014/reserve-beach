import { JSX } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCard, PasswordInput, EmailInput } from "../../components";
import LoginTemplate from "../LoginTemplate";
import { FakeService } from "../../service";
import { ILoginForm } from "../../types/forms";
import { CustomLink } from "./styles";

export default function Login(): JSX.Element {
    const navigate = useNavigate(); 

    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<ILoginForm>({
        mode: "onSubmit", 
    });

    const email = watch("email", ""); 
    const password = watch("password", ""); 
    const rememberMe = watch("rememberMe", false);

    const onSubmit: SubmitHandler<ILoginForm> = async () => {
        try {
            const response = await FakeService.make(email, password);

            if(!response) return;
            
            navigate("/");
        } catch (error) {
            alert("Credenciais inválidas");
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

                <FormGroup>
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                {...register("rememberMe")} 
                                defaultChecked={rememberMe} 
                            />
                        } 
                        label="Lembrar minha senha" 
                        title="Caso selecionado o sistema manterá você logado" 
                    />
                </FormGroup>

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