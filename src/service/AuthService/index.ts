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
};