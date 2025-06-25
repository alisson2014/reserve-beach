import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCard, PasswordInput, EmailInput} from "../../components";
import { ILoginForm } from "../../types/forms";
import { Button, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import LoginTemplate from "../LoginTemplate";
import { PersonInput } from "../../components/CustomInputs";
import { useToast } from "../../contexts";
import { RegisterService } from "../../service";

export default function Register(): JSX.Element {
    const { showToast } = useToast();

    const navigate = useNavigate(); 
    const registerService = RegisterService.getInstance();

    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<ILoginForm>({
        mode: "onSubmit", 
    });

    const email = watch("email", "");
    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");
    const rememberMe = watch("rememberMe", false);
    const name = watch("name", "");
    const lastName = watch("lastName", "");

    const onSubmit: SubmitHandler<ILoginForm> = async data => {
        try {
            const { message } = await registerService.save(data);

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
                <Button 
                    variant="contained"
                    aria-label="Realizar o registro com as credenciais"
                    title="Realizar registro com as credenciais"
                    type="submit"
                    disabled={!isValid}
                >
                    Registrar
                </Button>

                <FormGroup>
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                {...register("rememberMe")} 
                                defaultChecked={rememberMe} 
                            />
                        } 
                        label="Manter a conta conectado" 
                        title="Caso selecionado o sistema manterá você logado" 
                    />
                </FormGroup>
            </LoginCard>
        </LoginTemplate>
    );
}