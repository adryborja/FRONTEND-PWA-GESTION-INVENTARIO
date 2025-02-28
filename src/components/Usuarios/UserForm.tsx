import { useState, useEffect, useRef } from "react";
import { usuarioService } from "../../services/usuarioService";
import { empresaService } from "../../services/empresaService";
import { rolService } from "../../services/rolService";
import { Usuario, Empresa, Rol } from "../../types/types";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect"; 

interface UserFormProps {
  usuario?: Usuario | null;
  onHide: () => void;
  onSaveSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ usuario, onHide, onSaveSuccess }) => {
  const [usuarioData, setUsuarioData] = useState<Partial<Usuario>>({
    nombre_completo: "",
    email: "",
    telefono: "",
    estado: "Activo",
    empresa: null,
    roles: [],
    passwordHash: "",
  });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (usuario) {
        setUsuarioData(prevData => ({
            ...prevData, // ✅ Mantener valores ya editados por el usuario
            id: usuario.id,
            nombre_completo: usuario.nombre_completo || "",
            email: usuario.email || "",
            telefono: usuario.telefono || "",
            estado: usuario.estado || "Activo",
            empresa: usuario.empresa ? { id: usuario.empresa.id } : null,
            roles: usuario.roles 
                ? usuario.roles.map((rol) => roles.find(r => r.id === rol.id) || { id: rol.id, nombre: `ID: ${rol.id}` }) 
                : [],
            passwordHash: usuario.passwordHash || "",
        }));
    }
}, [usuario, roles]); // ✅ Se ejecuta solo cuando cambia `usuario`

// ✅ Cargar empresas y roles solo una vez al montar el componente
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

        console.log("Enviando datos al backend:", JSON.stringify(usuarioPayload, null, 2)); 

        if (usuario && usuario.id) {
            await usuarioService.update(usuario.id, usuarioPayload);
            toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Usuario actualizado correctamente",
                life: 3000,
            });
        } else {
            await usuarioService.create(usuarioPayload);
            toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Usuario creado correctamente",
                life: 3000,
            });
        }
        onSaveSuccess(); 
        onHide(); 

    } catch (error) {
        console.error("Error al guardar usuario:", error);
        toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo guardar el usuario",
            life: 3000,
        });
    }
};

  return (
    <div>
      <Toast ref={toast} />
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
        <label>Empresa:</label>
        <Dropdown
          value={usuarioData.empresa || null}
          options={empresas}
          optionLabel="nombre"
          placeholder="Seleccione una empresa"
          onChange={(e) => setUsuarioData({ ...usuarioData, empresa: e.value || null })}
        />
      </div>

      <div className="p-field">
        <label>Rol:</label>
        <MultiSelect
  value={usuarioData.roles || []} 
  options={roles} 
  optionLabel="nombre" 
  placeholder="Seleccione uno o más roles"
  onChange={(e) => {
      setUsuarioData({ ...usuarioData, roles: e.value });
  }}
  display="chip"
  showSelectAll={true}
  selectAllLabel="Seleccionar Todos"
  emptyFilterMessage="No hay roles disponibles"
  emptyMessage="No hay roles disponibles"
/>
      </div>

      <div className="p-field">
        <label>Estado:</label>
        <Dropdown
          value={usuarioData.estado}
          options={[
            { label: "Activo", value: "Activo" },
            { label: "Inactivo", value: "Inactivo" },
          ]}
          onChange={(e) => setUsuarioData({ ...usuarioData, estado: e.value })}
          placeholder="Seleccione el estado"
        />
      </div>

      <div className="p-field">
        <label>Password Hash:</label>
        <InputText
          value={usuarioData.passwordHash || ""}
          onChange={(e) => setUsuarioData({ ...usuarioData, passwordHash: e.target.value })}
        />
      </div>

      <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={saveUsuario} />
      <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={onHide} />
    </div>
  );
};
