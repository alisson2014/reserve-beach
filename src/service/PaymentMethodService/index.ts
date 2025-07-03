import axios from "axios";
import api from "../../api";
import { PaymentMethod } from "../../types/payment_method";

export class PaymentMethodService {
    private static instance: PaymentMethodService;

    private constructor() {}

    public static getInstance(): PaymentMethodService {
        if (!PaymentMethodService.instance) {
            PaymentMethodService.instance = new PaymentMethodService();
        }
        return PaymentMethodService.instance;
    }

    public async all(): Promise<PaymentMethod[]> {
        try {
            const urlSearchParams = new URLSearchParams();
            urlSearchParams.append('active', 'true');
            const { data } = await api.get('/payment_methods', { params: urlSearchParams });
            return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao buscar métodos de pagamento.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de busca de métodos de pagamento.');
            }
            throw new Error('Ocorreu um erro desconhecido ao buscar os métodos de pagamento.');
        }
    }
}