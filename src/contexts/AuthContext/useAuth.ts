import { createContext, useContext } from "react";
import { IAuthContext } from "./types";

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
};