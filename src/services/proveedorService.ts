import { Proveedor } from "../types/types";
import { fetchAPI } from "./api";

export const proveedorService = {
  findAll: async (): Promise<Proveedor[]> => {
    return await fetchAPI('/proveedores');
  },
  findOne: async (id_proveedor: number): Promise<Proveedor> => {
    return await fetchAPI(`/proveedores/${id_proveedor}`);
  },
  create: async (data: Partial<Proveedor>): Promise<Proveedor> => {
    return await fetchAPI('/proveedores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id_proveedor: number, data: Partial<Proveedor>): Promise<Proveedor> => {
    return await fetchAPI(`/proveedores/${id_proveedor}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id_proveedor: number): Promise<void> => {
    return await fetchAPI(`/proveedores/${id_proveedor}`, {
      method: 'DELETE',
    });
  },
};

