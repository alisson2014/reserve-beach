import axios from "axios";
import api from "../../api";
import { ILoginForm } from "../../types/forms";
import { IRegisterResponse } from "./types";

export class RegisterService {
    private static instance: RegisterService;

    private constructor() {}

    public static getInstance(): RegisterService {
        if (!RegisterService.instance) {
            RegisterService.instance = new RegisterService();
        }
        
        return RegisterService.instance;
    }

    public async save(user: ILoginForm): Promise<IRegisterResponse> {
        try {
            const { data } = await api.post("/client/register", user);
            
            return { message: data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if(error.response.data.errors && typeof error.response.data.errors === 'object') {
                        throw new Error(Object.values(error.response.data.errors).join(', '));
                    }

                    throw new Error(error.response.data.message || 'Erro ao realizar cadastro.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                } 

                throw new Error('Erro ao configurar a requisição de login.');
            } 
            
            throw new Error('Ocorreu um erro desconhecido durante o login.');
        }
    }
};