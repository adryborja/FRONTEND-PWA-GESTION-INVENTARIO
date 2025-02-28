import { Inventario } from "../types/types";
import { fetchAPI } from "./api";

export const inventarioService = {
  findAll: async (): Promise<Inventario[]> => {
    return await fetchAPI('/inventarios');
  },
  findOne: async (id_inventario: number): Promise<Inventario> => {
    return await fetchAPI(`/inventarios/${id_inventario}`);
  },
  update: async (id_inventario: number, data: Partial<Inventario>): Promise<Inventario> => {
    return await fetchAPI(`/inventarios/${id_inventario}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
