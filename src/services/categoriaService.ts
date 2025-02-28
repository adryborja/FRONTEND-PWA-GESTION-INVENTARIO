import { fetchAPI } from "./api";
import { Categoria } from "../types/types";

export const categoriaService = {
    findAll: async (): Promise<Categoria[]> => {
        return await fetchAPI('/categorias');
    },
    findOne: async (id_categoria: number): Promise<Categoria> => {
        return await fetchAPI(`/categorias/${id_categoria}`);
    },
    create: async (data: Partial<Categoria>): Promise<Categoria> => {
        return await fetchAPI('/categorias', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id_categoria: number, data: Partial<Categoria>): Promise<Categoria> => {
        return await fetchAPI(`/categorias/${id_categoria}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    remove: async (id_categoria: number): Promise<void> => {
        return await fetchAPI(`/categorias/${id_categoria}`, {
            method: 'DELETE',
        });
    },
};
