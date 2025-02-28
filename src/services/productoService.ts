import { Producto } from "../types/types";
import { fetchAPI } from "./api";

export const productoService = {
  findAll: async (): Promise<Producto[]> => {
    return await fetchAPI('/productos');
  },
  findOne: async (id_producto: number): Promise<Producto> => {
    return await fetchAPI(`/productos/${id_producto}`);
  },
  create: async (data: Partial<Producto>): Promise<Producto> => {
    return await fetchAPI('/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id_producto: number, data: Partial<Producto>): Promise<Producto> => {
    return await fetchAPI(`/productos/${id_producto}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id_producto: number): Promise<void> => {
    return await fetchAPI(`/productos/${id_producto}`, {
      method: 'DELETE',
    });
  },
};
