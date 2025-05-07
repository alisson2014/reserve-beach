import { JSX } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import LoginCard from "../../components/LoginCard";
import LoginTemplate from "../LoginTemplate";
import { EmailInput, PasswordInput } from "../../components/CustomInputs";
import { FakeService } from "../../service";
import { ILoginForm } from "../../types/forms";
import "./styles.css";

export default function Login(): JSX.Element {
    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<ILoginForm>({
        mode: "onChange", 
    });

    const email = watch("email", ""); 
    const password = watch("password", ""); 
    const rememberMe = watch("rememberMe", false);

    const onSubmit: SubmitHandler<ILoginForm> = async () => {
        try {
            const response = await FakeService.make(email, password);
            console.log("Login successful", response);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <LoginTemplate>
            <form onSubmit={handleSubmit(onSubmit)}>
                <LoginCard>   
                    <Typography variant="h4" sx={{ textAlign: "center" }}>Login</Typography>
                    
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

                    <Link 
                        className="login-link" 
                        title="Clique aqui para realizar a recuperação da senha" 
                        to="/forgotPassword"
                    >
                        Esqueceu a senha ?
                    </Link> 

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

                    <Link 
                        className="login-link"
                        title="Clique aqui para se cadastrar no sistema" 
                        to="/register"
                    >
                        Registrar-se
                    </Link>
                </LoginCard>
            </form>
        </LoginTemplate>
    );
};