import { Pedido} from "../types/types";
import { fetchAPI } from "./api";

export const pedidoService = {
  /** ✅ OBTENER TODOS LOS PEDIDOS */
  findAll: async (): Promise<Pedido[]> => {
    return await fetchAPI('/pedidos?_expand=empresa');
  },

  /** ✅ OBTENER UN PEDIDO POR ID */
  findOne: async (id_pedido: number): Promise<Pedido> => {
    return await fetchAPI(`/pedidos/${id_pedido}?_expand=empresa`);
  },

  /** ✅ CREAR UN PEDIDO */
  create: async (data: Partial<Pedido>): Promise<Pedido> => {
    return await fetchAPI('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** ✅ ACTUALIZAR UN PEDIDO */
  update: async (id_pedido: number, data: Partial<Pedido>): Promise<Pedido> => {
    return await fetchAPI(`/pedidos/${id_pedido}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** ✅ ELIMINAR UN PEDIDO */
  remove: async (id_pedido: number): Promise<void> => {
    return await fetchAPI(`/pedidos/${id_pedido}`, {
      method: 'DELETE',
    });
  },

};
