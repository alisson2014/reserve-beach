import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ILoginForm } from "../../../types/forms";

export interface PersonInputProps {
    label?: string;   
    personValue: string;
    register: UseFormRegister<ILoginForm>;
    errors: FieldErrors<ILoginForm>;
    name?: "email" | "password" | "confirmPassword" | "name" | "lastName";
};