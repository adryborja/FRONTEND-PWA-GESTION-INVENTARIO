import { useState, useEffect, useRef } from "react";
import { DetallePedido, Pedido, Producto } from "../../types/types";
import { detallePedidoService } from "../../services/detallePedidoService";
import { pedidoService } from "../../services/pedidoService";
import { productoService } from "../../services/productoService";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface DetailFormProps {
  detalle?: DetallePedido | null;
  onHide: () => void;
  onSaveSuccess: (isEdit: boolean) => void;
}

export const DetailForm: React.FC<DetailFormProps> = ({ detalle, onHide, onSaveSuccess }) => {
  const toast = useRef<Toast>(null);
  const [detalleData, setDetalleData] = useState<Partial<DetallePedido>>({
    pedido: null,
    producto: null,
    cantidad: 0,
    precio_unitario: 0,
  });

  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    loadPedidos();
    loadProductos();
  }, []);
  
  useEffect(() => {
    if (detalle) {
      setDetalleData({
        id: detalle.id,
        pedido: detalle.pedido ? pedidos.find((p) => p.id === detalle.pedido?.id) || detalle.pedido : null,
        producto: detalle.producto ? productos.find((p) => p.id === detalle.producto?.id) || detalle.producto : null,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
      });
    }
  }, [detalle, pedidos, productos]);
  

  const loadPedidos = async () => {
    try {
      const data = await pedidoService.findAll();
      setPedidos(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los pedidos",
        life: 3000,
      });
    }
  };

  const loadProductos = async () => {
    try {
      const data = await productoService.findAll();
      setProductos(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los productos",
        life: 3000,
      });
    }
  };

  const saveDetalle = async () => {
    try {
      if (
        !detalleData.pedido || !detalleData.pedido.id ||
        !detalleData.producto || !detalleData.producto.id ||
        detalleData.cantidad <= 0 || 
        detalleData.precio_unitario <= 0
      ) {
        toast.current?.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "Todos los campos son obligatorios",
          life: 3000,
        });
        return;
      }

      let isEdit = false;

      if (detalleData.id) {
        await detallePedidoService.update(detalleData.id, {
          ...detalleData,
          pedido: { id: detalleData.pedido.id }, 
          producto: { id: detalleData.producto.id }, 
        });
        isEdit = true;
      } else {
        await detallePedidoService.create({
          ...detalleData,
          pedido: { id: detalleData.pedido.id }, 
          producto: { id: detalleData.producto.id }, 
        });
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: isEdit ? "Detalle actualizado correctamente" : "Detalle creado correctamente",
        life: 3000,
      });

      onSaveSuccess(isEdit);
      onHide();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el detalle",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <h3>Información del Detalle del Pedido</h3>

      <div className="p-field">
        <label>Pedido:</label>
        <Dropdown
          value={detalleData.pedido}
          options={pedidos}
          optionLabel="id"
          onChange={(e) => setDetalleData({ ...detalleData, pedido: e.value })}
          placeholder="Seleccione un pedido"
        />
      </div>

      <div className="p-field">
        <label>Producto:</label>
        <Dropdown
          value={detalleData.producto}
          options={productos}
          optionLabel="nombre"
          onChange={(e) => setDetalleData({ ...detalleData, producto: e.value })}
          placeholder="Seleccione un producto"
        />
      </div>

      <div className="p-field">
        <label>Cantidad:</label>
        <InputNumber
          value={detalleData.cantidad}
          onValueChange={(e) => setDetalleData({ ...detalleData, cantidad: e.value || 0 })}
          min={1}
        />
      </div>

      <div className="p-field">
        <label>Precio Unitario:</label>
        <InputNumber
          value={detalleData.precio_unitario}
          onValueChange={(e) => setDetalleData({ ...detalleData, precio_unitario: e.value || 0 })}
          min={0}
          mode="currency"
          currency="USD"
        />
      </div>

      <Button label="Guardar Detalle" icon="pi pi-save" className="p-button-success" onClick={saveDetalle} />
      <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={onHide} />
    </div>
  );
};
