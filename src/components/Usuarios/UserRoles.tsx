import { useEffect, useState, useRef } from "react";
import { Usuario, Rol } from "../../types/types";
import { usuarioService } from "../../services/usuarioService";
import { rolService } from "../../services/rolService";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

interface UserRolesProps {
  usuario: Usuario;
  onHide: () => void;
}

export const UserRoles: React.FC<UserRolesProps> = ({ usuario, onHide }) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRole, setSelectedRole] = useState<Rol | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await rolService.findAll();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar los roles:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "Error al cargar los roles", life: 3000 });
    }
  };

  const assignRole = async () => {
    if (!selectedRole) return;
    try {
      await usuarioService.asignarRol(usuario.id!, selectedRole.id!);
      toast.current?.show({ severity: "success", summary: "Éxito", detail: "Rol asignado correctamente", life: 3000 });
      onHide();
    } catch (error) {
      console.error("Error al asignar el rol:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "Error al asignar el rol", life: 3000 });
    }
  };

  return (
    <Dialog header="Asignar Rol" visible={true} onHide={onHide}>
      <Toast ref={toast} />
      <div>
        <label>Seleccionar Rol:</label>
        <Dropdown
          value={selectedRole}
          options={roles}
          optionLabel="nombre"
          placeholder="Selecciona un rol"
          onChange={(e) => setSelectedRole(e.value)}
        />
      </div>
      <div className="p-d-flex p-jc-between p-mt-3">
        <Button label="Asignar" icon="pi pi-check" onClick={assignRole} />
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      </div>
    </Dialog>
  );
};

