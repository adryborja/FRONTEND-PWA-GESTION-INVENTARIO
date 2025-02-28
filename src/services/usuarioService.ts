import { Usuario } from "../types/types";
import { fetchAPI } from "./api";

export const usuarioService = {
  findAll: async (): Promise<Usuario[]> => {
    return await fetchAPI('/usuarios');
  },
  findOne: async (id_usuario: number): Promise<Usuario> => {
    return await fetchAPI(`/usuarios/${id_usuario}`);
  },
  create: async (data: Partial<Usuario>): Promise<Usuario> => {
    return await fetchAPI('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id_usuario: number, data: Partial<Usuario>): Promise<Usuario> => {
    return await fetchAPI(`/usuarios/${id_usuario}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  remove: async (id_usuario: number): Promise<void> => {
    return await fetchAPI(`/usuarios/${id_usuario}`, {
      method: 'DELETE',
    });
  },

  asignarRol: async (id_usuario: number, id_rol: number): Promise<void> => {
    return await fetchAPI(`/usuarios/${id_usuario}/roles/${id_rol}`, {
      method: "POST",
    });
  },
};


