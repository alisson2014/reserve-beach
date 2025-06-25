import { useState, useEffect, useMemo, JSX, ReactNode } from 'react';
import { ILoginResponse, IUser } from '../../service/AuthService/types';
import { AuthService } from '../../service';
import { AuthContext } from './useAuth';
import { useToast } from '../ToastContext/useToast';

const authService = AuthService.getInstance();

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const { showToast } = useToast();

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    useEffect(() => {
        const initAuth = async () => {
            const authenticatedUser = await authService.validateToken();
            if (authenticatedUser) {
                setUser(authenticatedUser);
            }
            setIsLoading(false);
        };
        
        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<ILoginResponse> => {
        try {
            const response = await authService.login(email, password);
            setUser(response.user);
            return response;
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Erro ao realizar login", "error");
            console.error("Login failed", error);
        }
    };

    const logout = (): void => {
        authService.logout();
        setUser(null);
    };

    const value = useMemo(() => ({
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout
    }), [user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};