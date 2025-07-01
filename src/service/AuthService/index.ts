import axios from "axios";
import api from "../../api";
import { ILoginResponse } from "./types";
import { User } from "../../types/user";

export class AuthService {
    private static instance: AuthService;
    private _token: string | null = null;
    private _user: User | null = null;

    private constructor() {
        const token = localStorage.getItem('token');

        if (!token) return;

        this._token = token;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        
        return AuthService.instance;
    }

    public get token(): string | null {
        return this._token;
    }

    public get user(): User | null {
        return this._user;
    }

    public set token(value: string | null) {
        this._token = value;
        if (value) {
            localStorage.setItem('token', value);
            api.defaults.headers.common['Authorization'] = `Bearer ${value}`;
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    }

    public set user(value: User | null) {
        this._user = value;
    }

    private setAuthData(token: string | null, user: User | null): void {
        this.token = token;
        this.user = user;
    }

    public logout(): null {
        this.setAuthData(null, null); 
        return null;
    }

    public isAuthenticated(): boolean {
        return this._token !== null && this._user !== null;
    }

    public async validateToken(): Promise<User | null> {
        if (!this._token) return null;

        try {
            const { data: { user, valid } } = await api.get('/user/token/validate'); 

            if(!valid) {
                return this.logout();
            }

            this.setAuthData(this._token, user);
            return user;
        } catch (error) {
            console.error("Falha ao validar o token:", error); 
            return this.logout();
        }
    }

    public async login(email: string, password: string): Promise<ILoginResponse> {
        try {
            const { data: { data: { token, user }, message, status } } = await api.post("/user/login", { email, password });
            
            if (status) {
                this.setAuthData(token, user);
            } 
            
            return { message, user, status };
        } catch (error) {
            this.logout();

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao realizar login.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                } 

                throw new Error('Erro ao configurar a requisição de login.');
            } 
            
            throw new Error('Ocorreu um erro desconhecido durante o login.');
        }
    }
};