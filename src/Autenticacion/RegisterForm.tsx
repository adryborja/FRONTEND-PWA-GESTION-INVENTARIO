import { useState, useEffect, useRef } from "react";
import { usuarioService } from "../services/usuarioService";
import { empresaService } from "../services/empresaService";
import { rolService } from "../services/rolService";
import { Usuario, Empresa, Rol } from "../types/types";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  const [usuarioData, setUsuarioData] = useState<Partial<Usuario>>({
    nombre_completo: "",
    email: "",
    telefono: "",
    empresa: null,
    roles: [],
    passwordHash: "",
    estado: "Activo", // ✅ Automáticamente "Activo"
  });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmpresas();
    loadRoles();
  }, []);

  const loadEmpresas = async () => {
    try {
      const data = await empresaService.findAll();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await rolService.findAll();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const saveUsuario = async () => {
    try {
      const usuarioPayload: Partial<Usuario> = {
        ...usuarioData,
        empresa: usuarioData.empresa ? { id: usuarioData.empresa.id } : null,
        roles: usuarioData.roles ? usuarioData.roles.map((rol) => ({ id: rol.id })) : [],
      };

      await usuarioService.create(usuarioPayload);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario registrado correctamente",
        life: 3000,
      });

      setTimeout(() => {
        navigate("/login"); // ✅ Redirigir al login después del registro
      }, 2000);
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo completar el registro",
        life: 3000,
      });
    }
  };

  const handleCancel = () => {
    navigate("/"); // ✅ Redirigir a la página de inicio
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "100vh" }}>
      <Toast ref={toast} />
      <div className="p-card p-shadow-4 p-p-4" style={{ width: "400px" }}>
        <h2>Registro de Usuario</h2>

        <div className="p-field">
          <label>Nombre Completo:</label>
          <InputText
            value={usuarioData.nombre_completo || ""}
            onChange={(e) => setUsuarioData({ ...usuarioData, nombre_completo: e.target.value })}
          />
        </div>

        <div className="p-field">
          <label>Email:</label>
          <InputText
            value={usuarioData.email || ""}
            onChange={(e) => setUsuarioData({ ...usuarioData, email: e.target.value })}
          />
        </div>

        <div className="p-field">
          <label>Teléfono:</label>
          <InputText
            value={usuarioData.telefono || ""}
            onChange={(e) => setUsuarioData({ ...usuarioData, telefono: e.target.value })}
          />
        </div>

        <div className="p-field">
          <label>Contraseña:</label>
          <Password
            value={usuarioData.passwordHash || ""}
            onChange={(e) => setUsuarioData({ ...usuarioData, passwordHash: e.target.value })}
            toggleMask
            feedback={false} // ✅ Eliminamos la barra de seguridad de la contraseña
          />
        </div>

        <div className="p-field">
          <label>Empresa:</label>
          <Dropdown
            value={usuarioData.empresa}
            options={empresas}
            optionLabel="nombre"
            placeholder="Seleccione una empresa"
            onChange={(e) => setUsuarioData({ ...usuarioData, empresa: e.value })}
          />
        </div>

        <div className="p-field">
          <label>Rol:</label>
          <MultiSelect
            value={usuarioData.roles || []}
            options={roles}
            optionLabel="nombre"
            placeholder="Seleccione uno o más roles"
            onChange={(e) => setUsuarioData({ ...usuarioData, roles: e.value })}
            display="chip"
            showSelectAll={true}
            selectAllLabel="Seleccionar Todos"
            emptyFilterMessage="No hay roles disponibles"
            emptyMessage="No hay roles disponibles"
          />
        </div>

        <div className="p-d-flex p-jc-end p-mt-3">
          <Button label="Registrar" icon="pi pi-user-plus" className="p-button-success" onClick={saveUsuario} />
          <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
