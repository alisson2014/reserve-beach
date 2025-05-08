import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ILoginForm } from "../../../types/forms";

export interface PasswordInputProps {
    label?: string;
    passwordValue: string;
    passwordId?: string;
    name?: "email" | "password" | "confirmPassword";
    register: UseFormRegister<ILoginForm>;
    errors: FieldErrors<ILoginForm>;
    isRegister?: boolean;
};