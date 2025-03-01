import { useEffect, useRef, useState } from "react";
import { pedidoService } from "../../services/pedidoService";
import { Pedido } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { OrderForm } from "./OrderForm";

export const OrderList: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await pedidoService.findAll();
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los pedidos",
        life: 3000,
      });
    }
  };

  const deletePedido = async (id: number) => {
    try {
      await pedidoService.remove(id);
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Pedido eliminado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el pedido",
        life: 3000,
      });
    }
  };

  const handleSaveSuccess = (isEdit: boolean) => {
    loadPedidos();

    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: isEdit ? "Pedido actualizado correctamente" : "Pedido creado correctamente",
      life: 3000,
    });

    setDisplayDialog(false);
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>Lista de Pedidos</h2>

      <Button
        label="Agregar Pedido"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setSelectedPedido(null);
          setDisplayDialog(true);
        }}
      />

      <DataTable value={pedidos} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID Pedido" sortable />
        <Column field="empresa.nombre" header="Empresa" sortable />
        <Column field="fecha_solicitud" header="Fecha Solicitud" sortable />
        <Column field="fecha_entrega" header="Fecha Entrega" sortable />
        <Column field="estado" header="Estado" sortable />

        <Column
          header="Acciones"
          body={(rowData: Pedido) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning"
                onClick={() => {
                  setSelectedPedido(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deletePedido(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog header={selectedPedido ? "Editar Pedido" : "Nuevo Pedido"} visible={displayDialog} onHide={() => setDisplayDialog(false)}>
        <OrderForm 
          pedido={selectedPedido} 
          onHide={() => setDisplayDialog(false)} 
          onSaveSuccess={handleSaveSuccess} 
        />
      </Dialog>
    </div>
  );
};
