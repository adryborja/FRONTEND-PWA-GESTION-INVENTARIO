import { Rol } from "../types/types";
import { fetchAPI } from "./api";

export const rolService = {
  findAll: async (): Promise<Rol[]> => {
    return await fetchAPI("/roles");
  },
  findOne: async (id: number): Promise<Rol> => {
    return await fetchAPI(`/roles/${id}`);
  },
  create: async (data: Partial<Rol>): Promise<Rol> => {
    return await fetchAPI("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Rol>): Promise<Rol> => {
    return await fetchAPI(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove: async (id: number): Promise<void> => {
    try {
      await fetchAPI(`/roles/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      throw new Error("No se pudo eliminar el rol. Puede estar asociado a otros registros.");
    }
  },
};

