import axios from "axios";
import api from "../../api";
import { ILoginResponse } from "./types";

export class AuthService {
    private static instance: AuthService;
    private _token: string | null = null;

    private constructor() {
        this._token = localStorage.getItem('token');
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

    public set token(value: string | null) {
        this._token = value;
        if (value) {
            localStorage.setItem('token', value);
        } else {
            localStorage.removeItem('token');
        }
    }

    public clearToken(): void {
        this.token = null;
    }

    public isAuthenticated(): boolean {
        return this._token !== null;
    }

    public async login(email: string, password: string): Promise<ILoginResponse> {
        try {
            const { data: { data: { token, user }, message, status } } = await api.post("/user/login", { email, password });
            
            if (status) {
                this.token = token;
            } 
            
            return { message, user };
        } catch (error) {
            this.clearToken();

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