import { Pedido } from "../types/types";
import { fetchAPI } from "./api";

export const pedidoService = {
  findAll: async (): Promise<Pedido[]> => {
    return await fetchAPI('/pedidos');
  },
  findOne: async (id_pedido: number): Promise<Pedido> => {
    return await fetchAPI(`/pedidos/${id_pedido}`);
  },
  create: async (data: Partial<Pedido>): Promise<Pedido> => {
    return await fetchAPI('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id_pedido: number, data: Partial<Pedido>): Promise<Pedido> => {
    return await fetchAPI(`/pedidos/${id_pedido}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id_pedido: number): Promise<void> => {
    return await fetchAPI(`/pedidos/${id_pedido}`, {
      method: 'DELETE',
    });
  },
};

