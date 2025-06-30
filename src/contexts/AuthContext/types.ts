import { User } from "../../types/user";
import { ILoginResponse } from "../../service/AuthService/types";

export interface IAuthContext {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<ILoginResponse>;
    logout: () => void;
};