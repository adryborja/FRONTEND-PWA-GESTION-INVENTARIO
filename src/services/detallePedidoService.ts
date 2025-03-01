import { DetallePedido } from "../types/types";
import { fetchAPI } from "./api";

export const detallePedidoService = {
  findAll: async (): Promise<DetallePedido[]> => {
    return await fetchAPI('/detalles-pedido');
  },
  findOne: async (id_detalle: number): Promise<DetallePedido> => {
    return await fetchAPI(`/detalles-pedido/${id_detalle}`);
  },
  create: async (data: Partial<DetallePedido>): Promise<DetallePedido> => {
    return await fetchAPI('/detalles-pedido', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id_detalle: number, data: Partial<DetallePedido>): Promise<DetallePedido> => {
    return await fetchAPI(`/detalles-pedido/${id_detalle}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id_detalle: number): Promise<void> => {
    return await fetchAPI(`/detalles-pedido/${id_detalle}`, {
      method: 'DELETE',
    });
  },
};