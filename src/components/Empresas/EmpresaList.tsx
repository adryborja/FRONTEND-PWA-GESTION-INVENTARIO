import { useEffect, useState, useRef } from "react";
import { empresaService } from "../../services/empresaService";
import { Empresa } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { EmpresaForm } from "./EmpresaForm";

export const EmpresaList: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      const data = await empresaService.findAll();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las empresas",
        life: 3000,
      });
    }
  };

  const deleteEmpresa = async (id: number) => {
    try {
      await empresaService.remove(id);
      setEmpresas((prevEmpresas) => prevEmpresas.filter((empresa) => empresa.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Empresa eliminada correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la empresa",
        life: 3000,
      });
    }
  };

  const handleSaveSuccess = (isEdit: boolean = false) => { // ✅ Se asegura un valor por defecto
    loadEmpresas();
  
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: isEdit ? "Empresa actualizada correctamente" : "Empresa creada correctamente",
      life: 3000,
    });
  
    setDisplayDialog(false);
  };
  

  return (
    <div>
      <Toast ref={toast} />

      {/* ✅ Botón para agregar una empresa */}
      <Button
        label="Agregar Empresa"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setSelectedEmpresa(null);
          setDisplayDialog(true);
        }}
      />

      {/* ✅ Tabla con lista de empresas */}
      <DataTable value={empresas} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="ruc" header="RUC" sortable />
        <Column field="direccion" header="Dirección" sortable />
        <Column field="telefono" header="Teléfono" sortable />
        <Column field="email_contacto" header="Email" sortable />
        <Column field="sector" header="Sector" sortable />
        <Column field="fechaCreacion" header="Fecha de Creación" sortable body={(rowData) => new Date(rowData.fechaCreacion).toLocaleDateString()} />
        <Column 
          header="Acciones"
          body={(rowData: Empresa) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => {
                  setSelectedEmpresa(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteEmpresa(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      {/* ✅ Modal para agregar/editar empresa */}
      <Dialog 
        header={selectedEmpresa ? "Editar Empresa" : "Nueva Empresa"} 
        visible={displayDialog} 
        onHide={() => setDisplayDialog(false)}
      >
        <EmpresaForm 
          empresa={selectedEmpresa} 
          onHide={() => setDisplayDialog(false)} 
          onSaveSuccess={handleSaveSuccess} 
        />
      </Dialog>
    </div>
  );
};
