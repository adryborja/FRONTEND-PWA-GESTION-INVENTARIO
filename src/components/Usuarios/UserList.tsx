import { useEffect, useState, useRef, useCallback } from "react";
import { usuarioService } from "../../services/usuarioService";
import { Usuario } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { UserForm } from "./UserForm";

export const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  
  const loadUsuarios = useCallback(async () => {
    try {
      const data = await usuarioService.findAll();
      setUsuarios([...data]); 
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los usuarios",
        life: 3000,
      });
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const deleteUsuario = async (id_usuario: number) => {
    try {
      await usuarioService.remove(id_usuario);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.id !== id_usuario)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario eliminado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el usuario",
        life: 3000,
      });
    }
  };


  const handleSaveSuccess = () => {
    loadUsuarios(); 
    toast.current?.show({ 
      severity: "success", 
      summary: "Éxito", 
      detail: "Usuario creado correctamente", 
      life: 3000 
    }); 
  };

  return (
    <div>
      <Toast ref={toast} />

      <Button
        label="Agregar Usuario"
        icon="pi pi-user-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setSelectedUsuario(null);
          setDisplayDialog(true);
        }}
      />

      <DataTable value={usuarios} paginator rows={10} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="nombre_completo" header="Nombre Completo" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="telefono" header="Teléfono" sortable />
        <Column field="estado" header="Estado" sortable />
        <Column
          field="fechaCreacion"
          header="Fecha Creación"
          sortable
          body={(rowData) =>
            new Date(rowData.fechaCreacion).toLocaleDateString()
          }
        />
        <Column
          field="ultimaConexion"
          header="Última Conexión"
          sortable
          body={(rowData) =>
            rowData.ultimaConexion
              ? new Date(rowData.ultimaConexion).toLocaleString()
              : "Nunca"
          }
        />
        <Column field="passwordHash" header="Contraseña" sortable />
        <Column
          field="roles"
          header="Rol"
          sortable
          body={(rowData) =>
            rowData.roles?.map((rol: { id: number; nombre: string }) => rol.nombre).join(", ") || "Sin rol"
          }
        />
        <Column
          field="empresa"
          header="Empresa"
          sortable
          body={(rowData) => rowData.empresa?.nombre || "No asignado"}
        />

        <Column
          header="Acciones"
          body={(rowData: Usuario) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => {
                  setSelectedUsuario(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteUsuario(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
  header={selectedUsuario ? "Editar Usuario" : "Nuevo Usuario"} 
  visible={displayDialog}
  onHide={() => setDisplayDialog(false)}
>
  <UserForm
    usuario={selectedUsuario}
    onHide={() => setDisplayDialog(false)}
    onSaveSuccess={handleSaveSuccess}
  />
</Dialog>
    </div>
  );
};
