import { useState, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { usuarioService } from "../services/usuarioService";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 🔹 Obtener todos los usuarios desde la API
      const users = await usuarioService.findAll();

      // 🔹 Buscar usuario por email
      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        throw new Error("Usuario no encontrado. Regístrese primero.");
      }

      // 🔹 Validar que el usuario esté activo
      if (foundUser.estado !== "Activo") {
        throw new Error("El usuario está inactivo. Contacte con un administrador.");
      }

      // 🔹 Validar la contraseña
      if (password !== foundUser.passwordHash) {
        throw new Error("Contraseña incorrecta.");
      }

      // 🔹 Validar que el usuario tenga al menos un rol
      if (!foundUser.roles || foundUser.roles.length === 0) {
        throw new Error("El usuario no tiene un rol asignado. Contacte con un administrador.");
      }

      // 🔹 Guardar usuario en `localStorage` para persistencia de sesión
      localStorage.setItem("user", JSON.stringify(foundUser));
      auth.login(email, password);

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Inicio de sesión exitoso",
        life: 3000,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error inesperado en el login";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "100vh", backgroundColor: "#1E1E2F" }}>
      <Toast ref={toast} />
      <div className="p-card p-shadow-4 p-p-4" style={{ width: "350px", backgroundColor: "#26293A", color: "#ffffff" }}>
        <h2 className="p-text-center">🔑 Iniciar Sesión</h2>

        <div className="p-field">
          <label>Email:</label>
          <InputText 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="p-inputtext-sm"
            style={{ width: "100%" }} 
          />
        </div>

        <div className="p-field">
          <label>Contraseña:</label>
          <Password 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            toggleMask 
            feedback={false}  // ✅ Se desactiva la barra de fortaleza de contraseña
            className="p-inputtext-sm"
            style={{ width: "100%" }} 
          />
        </div>

        <Button 
          label="Iniciar Sesión" 
          icon="pi pi-sign-in" 
          className="p-button-primary p-mt-3" 
          onClick={handleLogin} 
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
