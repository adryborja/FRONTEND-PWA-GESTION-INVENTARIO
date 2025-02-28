import { MovimientoInventario } from "../types/types";
import { fetchAPI } from "./api";

export const movimientoService = {
  findAll: async (): Promise<MovimientoInventario[]> => {
    return await fetchAPI('/movimientos');
  },
  findOne: async (id_movimiento: number): Promise<MovimientoInventario> => {
    return await fetchAPI(`/movimientos/${id_movimiento}`);
  },
  create: async (data: Partial<MovimientoInventario>): Promise<MovimientoInventario> => {
    return await fetchAPI('/movimientos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id_movimiento: number, data: Partial<MovimientoInventario>): Promise<MovimientoInventario> => {
    return await fetchAPI(`/movimientos/${id_movimiento}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id_movimiento: number): Promise<void> => {
    return await fetchAPI(`/movimientos/${id_movimiento}`, {
      method: 'DELETE',
    });
  },
};


