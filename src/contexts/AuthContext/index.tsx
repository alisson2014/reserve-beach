import { useState, useEffect, useMemo, JSX, useCallback } from 'react';
import { ILoginResponse } from '../../service/AuthService/types';
import { AuthService } from '../../service';
import { AuthContext } from './useAuth';
import { useToast } from '../ToastContext/useToast';
import { User } from '../../types/user';
import { IAuthProviderProps } from './types';

const authService = AuthService.getInstance();

export default function AuthProvider({ children }: IAuthProviderProps): JSX.Element {
    const { showToast } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    const validateToken = useCallback(async (): Promise<void> => {
        const authenticatedUser = await authService.validateToken();

        if (authenticatedUser) {
            setUser(authenticatedUser);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<ILoginResponse> => {
        try {
            const response = await authService.login(email, password);
            if(response.status) {
                setUser(response.user);
            }

            return response;
        } catch (error: Error | unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao realizar login";
            showToast(errorMessage, "error");
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

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};