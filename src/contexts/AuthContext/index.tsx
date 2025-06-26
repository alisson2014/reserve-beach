import { useState, useEffect, useMemo, JSX, ReactNode, useCallback } from 'react';
import { ILoginResponse } from '../../service/AuthService/types';
import { AuthService } from '../../service';
import { AuthContext } from './useAuth';
import { useToast } from '../ToastContext/useToast';
import { User } from '../../types/user';

const authService = AuthService.getInstance();

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const { showToast } = useToast();

    const [user, setUser] = useState<User | null>(null);
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

    const login = useCallback(async (email: string, password: string): Promise<ILoginResponse> => {
        try {
            const response = await authService.login(email, password);
            if(response.status) {
                setUser(response.user);
            }

            return response;
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Erro ao realizar login", "error");
            console.error("Login failed", error);
            return {} as ILoginResponse;
        }
    }, [showToast]);

    const logout = useCallback((): void => {
        authService.logout();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout
    }), [user, isLoading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};