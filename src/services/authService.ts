import { usuarioService } from "./usuarioService";

export const authService = {
  login: async (email: string, password: string) => {
    const users = await usuarioService.findAll();
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser) {
      throw new Error("Usuario no encontrado");
    }

    if (foundUser.estado !== "Activo") {
      throw new Error("El usuario está inactivo, contacta con un administrador.");
    }

    if (password !== foundUser.passwordHash) {
      throw new Error("Contraseña incorrecta");
    }

    localStorage.setItem("user", JSON.stringify(foundUser));
    return foundUser;
  },

  register: async (data: { nombre_completo: string; email: string; password: string }) => {
    return await usuarioService.create({
      nombre_completo: data.nombre_completo,
      email: data.email,
      passwordHash: data.password,
      estado: "Activo", // ✅ Todos los registros se crean como Activo
      roles: [{ id: 3 }], // ✅ Se asigna rol por defecto
    });
  },

  getProfile: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem("user");
  },
};
