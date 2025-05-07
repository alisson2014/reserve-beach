import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ILoginForm } from "../../../types/forms";

export interface PasswordInputProps {
    label?: string;
    passwordValue: string;
    passwordId?: string;
    register: UseFormRegister<ILoginForm>;
    errors: FieldErrors<ILoginForm>;
    isRegister?: boolean;
};