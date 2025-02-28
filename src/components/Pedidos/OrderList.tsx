import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { pedidoService } from "../../services/pedidoService";
import { Pedido } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { OrderForm } from "./OrderForm";

export const OrderList = forwardRef((_props, ref) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const toast = useRef<Toast>(null);

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

 
  useImperativeHandle(ref, () => ({
    loadPedidos
  }));

  useEffect(() => {
    loadPedidos();
  }, []);

  const formatDate = (value: string | Date | null) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  const deleteRecord = async (id: number) => {
    try {
      await pedidoService.remove(id);
      setPedidos(pedidos.filter(p => p.id !== id));
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

  const editRecord = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setEditDialogVisible(true);
  };

  const handleEditSuccess = () => {
    loadPedidos();
    setEditDialogVisible(false);
    setSelectedPedido(null);
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Pedido actualizado correctamente",
      life: 3000,
    });
  };

  const actionBodyTemplate = (rowData: Pedido) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-sm"
          onClick={() => editRecord(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => deleteRecord(rowData.id)}
        />
      </div>
    );
  };

  const hideEditDialog = () => {
    setEditDialogVisible(false);
    setSelectedPedido(null);
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>Lista de Pedidos</h2>
      <DataTable
        value={pedidos}
        paginator
        rows={10}
        responsiveLayout="scroll"
        emptyMessage="No hay pedidos disponibles"
      >
        <Column field="id" header="ID" sortable />
        <Column field="empresa.nombre" header="Empresa" sortable />
        <Column
          field="fecha_solicitud"
          header="Fecha Solicitud"
          sortable
          body={(rowData) => formatDate(rowData.fecha_solicitud)}
        />
        <Column
          field="fecha_entrega"
          header="Fecha Entrega"
          sortable
          body={(rowData) => formatDate(rowData.fecha_entrega)}
        />
        <Column field="estado" header="Estado" sortable />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>

      { }
      <Dialog
        header="Editar Pedido"
        visible={editDialogVisible}
        style={{ width: '50vw' }}
        onHide={hideEditDialog}
      >
        {selectedPedido && (
          <OrderForm 
            pedidoToEdit={selectedPedido}
            onSaveSuccess={handleEditSuccess}
            onHide={hideEditDialog}
          />
        )}
      </Dialog>
    </div>
  );
});
