import { useEffect, useState, useRef } from "react";
import { rolService } from "../services/rolService";
import { Rol } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [nuevoRol, setNuevoRol] = useState<Partial<Rol>>({ nombre: "", descripcion: "" });
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await rolService.findAll();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar los roles", life: 3000 });
    }
  };

  const saveRol = async () => {
    try {
      if (selectedRol) {
        await rolService.update(selectedRol.id, nuevoRol);
        toast.current?.show({ severity: "success", summary: "Éxito", detail: "Rol actualizado correctamente", life: 3000 });
      } else {
        await rolService.create(nuevoRol);
        toast.current?.show({ severity: "success", summary: "Éxito", detail: "Rol creado correctamente", life: 3000 });
      }
      setDisplayDialog(false);
      loadRoles();
    } catch (error) {
      console.error("Error al guardar rol:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo guardar el rol", life: 3000 });
    }
  };

  const deleteRol = async (id: number) => {
    try {
      await rolService.remove(id);

    
      setRoles((prevRoles) => prevRoles.filter((rol) => rol.id !== id));

      toast.current?.show({ severity: "success", summary: "Éxito", detail: "Rol eliminado correctamente", life: 3000 });
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      
      setTimeout(() => {
        loadRoles();
      }, 500);

      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar el rol", life: 3000 });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <h1>Gestión de Roles</h1>

      <Button
        label="Agregar Rol"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setNuevoRol({ nombre: "", descripcion: "" });
          setSelectedRol(null);
          setDisplayDialog(true);
        }}
      />

      <DataTable value={roles} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="descripcion" header="Descripción" sortable />
        <Column field="fechaCreacion" header="Fecha de Creación" sortable body={(rowData) => new Date(rowData.fechaCreacion).toLocaleDateString()} />
        <Column
          header="Acciones"
          body={(rowData: Rol) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => {
                  setNuevoRol(rowData);
                  setSelectedRol(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteRol(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={selectedRol ? "Editar Rol" : "Nuevo Rol"}
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)}
      >
        <div className="p-field">
          <label>Nombre:</label>
          <InputText
            value={nuevoRol.nombre || ""}
            onChange={(e) => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
          />
        </div>
        <div className="p-field">
          <label>Descripción:</label>
          <InputText
            value={nuevoRol.descripcion || ""}
            onChange={(e) => setNuevoRol({ ...nuevoRol, descripcion: e.target.value })}
          />
        </div>
        <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={saveRol} />
      </Dialog>
    </div>
  );
};

export default Roles;
