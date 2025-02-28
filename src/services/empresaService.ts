import { Empresa } from "../types/types";
import { fetchAPI } from "./api";

export const empresaService = {
  findAll: async (): Promise<Empresa[]> => {
    return await fetchAPI('/empresas');
  },
  findOne: async (id: number): Promise<Empresa> => {
    return await fetchAPI(`/empresas/${id}`);
  },
  create: async (data: Partial<Empresa>): Promise<Empresa> => {
    return await fetchAPI('/empresas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Empresa>): Promise<Empresa> => {
    return await fetchAPI(`/empresas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id: number): Promise<void> => {
    return await fetchAPI(`/empresas/${id}`, {
      method: 'DELETE',
    });
  },
};
