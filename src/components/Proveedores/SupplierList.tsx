import { useEffect, useRef, useState } from "react";
import { proveedorService } from "../../services/proveedorService";
import { Proveedor } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { SupplierForm } from "./SupplierForm";

export const SupplierList: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const data = await proveedorService.findAll();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los proveedores",
        life: 3000,
      });
    }
  };

  const deleteProveedor = async (id: number) => {
    try {
      await proveedorService.remove(id);
      setProveedores((prevProveedores) => prevProveedores.filter((proveedor) => proveedor.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Proveedor eliminado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el proveedor",
        life: 3000,
      });
    }
  };

  const handleSaveSuccess = (isEdit: boolean = false) => {
    loadProveedores(); // ✅ Recarga la lista automáticamente

    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: isEdit ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente",
      life: 3000,
    });

    setDisplayDialog(false);
  };

  return (
    <div>
      <Toast ref={toast} />

      {/* ✅ Botón para agregar un nuevo proveedor */}
      <Button
        label="Agregar Proveedor"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setSelectedProveedor(null);
          setDisplayDialog(true);
        }}
      />

      <DataTable value={proveedores} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="contacto" header="Contacto" sortable />
        <Column field="telefono" header="Teléfono" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="direccion" header="Dirección" sortable />
        <Column 
          field="fechaCreacion" 
          header="Fecha de Creación" 
          sortable 
          body={(rowData) => new Date(rowData.fechaCreacion).toLocaleDateString()} 
        />
        <Column 
          header="Acciones"
          body={(rowData: Proveedor) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => {
                  setSelectedProveedor(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteProveedor(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      {/* ✅ Modal para agregar/editar proveedores */}
      <Dialog 
        header={selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"} 
        visible={displayDialog} 
        onHide={() => setDisplayDialog(false)}
      >
        <SupplierForm 
          proveedor={selectedProveedor} 
          onHide={() => setDisplayDialog(false)} 
          onSave={handleSaveSuccess} 
        />
      </Dialog>
    </div>
  );
};
