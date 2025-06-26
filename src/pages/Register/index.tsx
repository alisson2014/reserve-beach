import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCard, PasswordInput, EmailInput, LoadingButton} from "../../components";
import { ILoginForm } from "../../types/forms";
import { Typography } from "@mui/material";
import LoginTemplate from "../LoginTemplate";
import { PersonInput } from "../../components/CustomInputs";
import { useToast } from "../../contexts";
import { RegisterService } from "../../service";
import { CustomLink } from "../Login/styles";

export default function Register(): JSX.Element {
    const { showToast } = useToast();

    const navigate = useNavigate(); 
    const registerService = RegisterService.getInstance();

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, watch } = useForm<ILoginForm>({
        mode: "onSubmit", 
    });

    const email = watch("email", "");
    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");
    const name = watch("name", "");
    const lastName = watch("lastName", "");

    const onSubmit: SubmitHandler<ILoginForm> = async data => {
        try {
            const registerPromise = registerService.save(data);

            const [registerResult] = await Promise.all([
                registerPromise,
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);

            const { message } = registerResult;

            if(message) {
                showToast(message, "success");
            }
            
            navigate("/login");
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Erro ao realizar cadastro", "error");
            console.error("Login failed", error);
        }
    };

    return (
        <LoginTemplate>
            <LoginCard onSubmit={handleSubmit(onSubmit)}>   
                <Typography variant="h4" component="h2" sx={{ textAlign: "center" }}>Cadastro</Typography>
                
                <PersonInput
                    personValue={name}
                    register={register}
                    errors={errors}
                    name="name"
                    label="Nome"
                />
                <PersonInput
                    personValue={lastName}
                    register={register}
                    errors={errors}
                    name="lastName"
                    label="Sobrenome"
                />
                <EmailInput 
                    emailValue={email} 
                    register={register} 
                    errors={errors} 
                />
                <PasswordInput 
                    passwordValue={password} 
                    register={register}
                    errors={errors}
                    name="password"
                />
                <PasswordInput
                    passwordValue={confirmPassword}
                    register={register}
                    errors={errors}
                    name="confirmPassword"
                    label="Confirmar Senha"
                />

                <LoadingButton
                    variant="contained"
                    aria-label="Realizar o registro com as credenciais"
                    title="Realizar registro com as credenciais"
                    type="submit"
                    disabled={!isValid}
                    loading={isSubmitting}
                >
                    Registrar
                </LoadingButton>

                <CustomLink
                    title="Já possui uma conta? Faça login" 
                    aria-label="Já possui uma conta? Faça login"
                    to="/login"
                >
                    Já possui uma conta? Faça login
                </CustomLink>
            </LoginCard>
        </LoginTemplate>
    );
}