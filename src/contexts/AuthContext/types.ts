import { User } from "../../types/user";
import { ILoginResponse } from "../../service/AuthService/types";

export interface IAuthContext {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean; // Para mostrar um loader enquanto valida o token
    login: (email: string, password: string) => Promise<ILoginResponse>;
    logout: () => void;
};