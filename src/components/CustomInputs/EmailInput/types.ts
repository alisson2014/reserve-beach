import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ILoginForm } from "../../../types/forms";

export interface EmailInputProps {
    emailValue: string;   
    register: UseFormRegister<ILoginForm>;
    errors: FieldErrors<ILoginForm>;
};