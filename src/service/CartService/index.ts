import axios from "axios";
import api from "../../api";
import { CartInformation, CartItemBody } from "./types";

export class CartService {
    private static instance: CartService;

    private constructor() {}

    public static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }

    public async getCartInfo(): Promise<CartInformation[]> {
        try {
            const { data } = await api.get('/cart/items');
            return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao buscar itens do carrinho.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de busca de itens do carrinho.');
            }
            throw new Error('Ocorreu um erro desconhecido ao buscar os itens do carrinho.');
        }
    }

    public async deleteItens(cartItemIds: readonly number[]): Promise<void> {
        try {
            await api.post(`/cart/items/delete`, { ids: cartItemIds });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao remover item do carrinho.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de remoção de item do carrinho.');
            }
            throw new Error('Ocorreu um erro desconhecido ao remover o item do carrinho.');
        }
    }

    public async addToCart(data: CartItemBody): Promise<void> {
        try {
            await api.post('/cart/items', data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.message || 'Erro ao buscar quadras.');
                } else if (error.request) {
                    throw new Error('Nenhuma resposta recebida do servidor.');
                }
                throw new Error('Erro ao configurar a requisição de busca de quadras.');
            }
            throw new Error('Ocorreu um erro desconhecido ao buscar as quadras.');
        }
    }
}