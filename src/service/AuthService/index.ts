import axios from "axios";
import api from "../../api";
import { ILoginResponse, IUser } from "./types";

export class AuthService {
    private static instance: AuthService;
    private _token: string | null = null;
    private _user: IUser | null = null;

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

    public get user(): IUser | null {
        return this._user;
    }

    public set token(value: string | null) {
        this._token = value;
        if (value) {
            localStorage.setItem('token', value);
        } else {
            localStorage.removeItem('token');
        }
    }

    private setAuthData(token: string | null, user: IUser | null): void {
        this._token = token;
        this._user = user;

        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    }

    public logout(): null {
        this.setAuthData(null, null); 
        return null;
    }

    public isAuthenticated(): boolean {
        return this._token !== null && this._user !== null;
    }

    public async validateToken(): Promise<IUser | null> {
        if (!this._token) return null;

        try {
            const { data: { user, valid } } = await api.get('/user/token/validate'); 

            if(!valid) {
                return this.logout();
            }

            this.setAuthData(this._token, user);
            return user;
        } catch (error) {
            return this.logout();
        }
    }

    public async login(email: string, password: string): Promise<ILoginResponse> {
        try {
            const { data: { data: { token, user }, message, status } } = await api.post("/user/login", { email, password });
            
            if (status) {
                this.token = token;
            } 
            
            return { message, user };
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