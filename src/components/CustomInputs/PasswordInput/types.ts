export interface PasswordInputProps {
    label?: string;
    passwordValue: string;
    setPasswordValue: (value: string) => void;
    passwordId?: string;
};