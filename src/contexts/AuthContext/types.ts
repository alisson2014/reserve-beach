import { ILoginResponse, IUser } from "../../service/AuthService/types";

export interface IAuthContext {
    isAuthenticated: boolean;
    user: IUser | null;
    isLoading: boolean; // Para mostrar um loader enquanto valida o token
    login: (email: string, password: string) => Promise<ILoginResponse>;
    logout: () => void;
};