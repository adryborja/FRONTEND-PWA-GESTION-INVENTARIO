import { useState, useEffect, useRef } from "react";
import { Pedido, Empresa } from "../../types/types";
import { pedidoService } from "../../services/pedidoService";
import { empresaService } from "../../services/empresaService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface OrderFormProps {
  pedido?: Pedido | null;
  onHide: () => void;
  onSaveSuccess: (isEdit: boolean) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ pedido, onHide, onSaveSuccess }) => {
  const toast = useRef<Toast>(null);
  const [pedidoData, setPedidoData] = useState<Partial<Pedido>>({
    empresa: null,
    fecha_entrega: null,
    estado: "Pendiente",
  });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    loadEmpresas();

    if (pedido) {
      setPedidoData({
        ...pedido,
        fecha_entrega: pedido.fecha_entrega ? new Date(pedido.fecha_entrega) : null,
      });
    } else {
      setPedidoData({
        empresa: null,
        fecha_entrega: null,
        estado: "Pendiente",
      });
    }
  }, [pedido]);

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

  const savePedido = async () => {
    try {
      if (!pedidoData.empresa || !pedidoData.fecha_entrega) {
        toast.current?.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "Todos los campos son obligatorios",
          life: 3000,
        });
        return;
      }
  
      let isEdit = false;
  
      if (pedidoData.id) {
        await pedidoService.update(pedidoData.id, pedidoData);
        isEdit = true;
      } else {
        await pedidoService.create(pedidoData);
      }
  
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: isEdit ? "Pedido actualizado correctamente" : "Pedido creado correctamente",
        life: 3000,
      });
  
      onSaveSuccess(isEdit);
      onHide();
    } catch (error) {
      console.error("Error al guardar pedido:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el pedido",
        life: 3000,
      });
    }
  };
  
  return (
    <div>
      <Toast ref={toast} />

      <h3>Información del Pedido</h3>

      <div className="p-field">
        <label>Empresa:</label>
        <Dropdown
          value={pedidoData.empresa}
          options={empresas}
          optionLabel="nombre"
          onChange={(e) => setPedidoData({ ...pedidoData, empresa: e.value })}
          placeholder="Seleccione una empresa"
        />
      </div>

      <div className="p-field">
        <label>Fecha de Entrega:</label>
        <Calendar
          value={pedidoData.fecha_entrega ? new Date(pedidoData.fecha_entrega) : null}
          onChange={(e) => setPedidoData({ ...pedidoData, fecha_entrega: e.value as Date })}
          dateFormat="dd/mm/yy"
        />
      </div>

      <div className="p-field">
        <label>Estado:</label>
        <Dropdown
          value={pedidoData.estado}
          options={[
            { label: "Pendiente", value: "Pendiente" },
            { label: "Entregado", value: "Entregado" },
            { label: "Cancelado", value: "Cancelado" },
          ]}
          onChange={(e) => setPedidoData({ ...pedidoData, estado: e.value })}
          placeholder="Seleccione el estado"
        />
      </div>

      <Button label="Guardar Pedido" icon="pi pi-save" className="p-button-success" onClick={savePedido} />
      <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={onHide} />
    </div>
  );
};
