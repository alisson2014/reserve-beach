import { createContext, useContext } from "react";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useToast must be used within a AuthProvider');
    }
    
    return context;
};