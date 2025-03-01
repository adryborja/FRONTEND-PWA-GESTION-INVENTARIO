import { useEffect, useRef, useState } from "react";
import { detallePedidoService } from "../../services/detallePedidoService"; 
import { DetallePedido } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { DetailForm } from "./DetailForm";

export const DetailList: React.FC = () => {
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [selectedDetalle, setSelectedDetalle] = useState<DetallePedido | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadDetalles();
  }, []);

  const loadDetalles = async () => {
    try {
      const data = await detallePedidoService.findAll(); 
      setDetalles(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los detalles de pedidos",
        life: 3000,
      });
    }
  };

  const deleteDetalle = async (id: number) => {
    try {
      await detallePedidoService.remove(id); 
      setDetalles((prev) => prev.filter((detalle) => detalle.id !== id));

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Detalle de pedido eliminado correctamente",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el detalle",
        life: 3000,
      });
    }
  };

  const handleSaveSuccess = (isEdit: boolean) => {
    loadDetalles();

    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: isEdit ? "Detalle actualizado correctamente" : "Detalle creado correctamente",
      life: 3000,
    });

    setDisplayDialog(false);
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>Lista de Detalles de Pedido</h2>

      <Button
        label="Agregar Detalle de Pedido"
        icon="pi pi-plus"
        className="p-button-primary p-mb-3"
        onClick={() => {
          setSelectedDetalle(null);
          setDisplayDialog(true);
        }}
      />

      <DataTable value={detalles} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID Detalle" sortable />
        <Column field="pedido.id" header="ID Pedido" sortable />
        <Column
          header="Producto"
          body={(rowData) => rowData.producto?.nombre || "Sin producto"} 
          sortable
        />
        <Column field="cantidad" header="Cantidad" sortable />
        <Column field="precio_unitario" header="Precio Unitario" sortable />

        <Column
          header="Acciones"
          body={(rowData: DetallePedido) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning"
                onClick={() => {
                  setSelectedDetalle(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteDetalle(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog header="Detalle del Pedido" visible={displayDialog} onHide={() => setDisplayDialog(false)}>
        <DetailForm detalle={selectedDetalle} onHide={() => setDisplayDialog(false)} onSaveSuccess={handleSaveSuccess} />
      </Dialog>
    </div>
  );
};
