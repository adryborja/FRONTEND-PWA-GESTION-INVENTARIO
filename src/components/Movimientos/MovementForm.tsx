import { useState, useEffect, useRef } from "react";
import { MovimientoInventario, Producto, Usuario } from "../../types/types";
import { movimientoService } from "../../services/movimientoService";
import { productoService } from "../../services/productoService";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

interface MovementFormProps {
  onSaveSuccess: () => void;
}

export const MovementForm: React.FC<MovementFormProps> = ({ onSaveSuccess }) => {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [movimiento, setMovimiento] = useState<Partial<MovimientoInventario>>({
    tipo_movimiento: undefined,
    cantidad: 0,
    producto: null,
    fecha_movimiento: "",
    motivo: "",
    costo_unitario: 0,
    ubicacion: "",
  });

  const [productos, setProductos] = useState<Producto[]>([]);
  const toast = useRef<Toast>(null);

  // 🔹 Obtener usuario autenticado de localStorage
  const usuario: Usuario | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await productoService.findAll();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // ✅ Función para limpiar el formulario cada vez que se abre o guarda un movimiento
  const resetForm = () => {
    setMovimiento({
      tipo_movimiento: undefined,
      cantidad: 0,
      producto: null,
      fecha_movimiento: "",
      motivo: "",
      costo_unitario: 0,
      ubicacion: "",
    });
  };

  const saveMovimiento = async () => {
    if (!movimiento.tipo_movimiento || !movimiento.producto?.id || (movimiento.cantidad ?? 0) <= 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Por favor, complete todos los campos obligatorios",
        life: 3000,
      });
      return;
    }

    if (!usuario?.id) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se ha identificado un usuario autenticado",
        life: 3000,
      });
      return;
    }

    try {
      console.log("✅ Enviando al backend:", {
        tipo_movimiento: movimiento.tipo_movimiento,
        cantidad: movimiento.cantidad ?? 0,
        producto: { id: movimiento.producto.id, nombre: movimiento.producto.nombre },
        fecha_movimiento: new Date().toISOString(),
        motivo: movimiento.motivo,
        costo_unitario: movimiento.costo_unitario ?? 0,
        ubicacion: movimiento.ubicacion,
        usuario: { id: usuario.id, nombre_completo: usuario.nombre_completo },
      });

      const payload = {
        tipo_movimiento: movimiento.tipo_movimiento,
        cantidad: movimiento.cantidad ?? 0,
        producto: { id: movimiento.producto.id, nombre: movimiento.producto.nombre },
        fecha_movimiento: new Date().toISOString(),
        motivo: movimiento.motivo,
        costo_unitario: movimiento.costo_unitario ?? 0,
        ubicacion: movimiento.ubicacion,
        usuario: { id: usuario.id, nombre_completo: usuario.nombre_completo },
      };

      await movimientoService.create(payload);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Movimiento registrado correctamente",
        life: 3000,
      });

      resetForm(); // ✅ Limpia el formulario después de guardar
      setDisplayDialog(false);
      onSaveSuccess();
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo registrar el movimiento",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      {/* ✅ Resetea el formulario cuando se abre el diálogo */}
      <Button
        label="Agregar Movimiento"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          resetForm(); // ✅ Limpia el formulario antes de abrir
          setDisplayDialog(true);
        }}
      />

      <Dialog header="Registrar Movimiento" visible={displayDialog} onHide={() => setDisplayDialog(false)}>
        <div className="p-field">
          <label>Tipo de Movimiento:</label>
          <Dropdown
            value={movimiento.tipo_movimiento}
            options={[
              { label: "Entrada", value: "Entrada" },
              { label: "Salida", value: "Salida" },
              { label: "Ajuste", value: "Ajuste" },
            ]}
            placeholder="Seleccione un tipo"
            onChange={(e) => setMovimiento({ ...movimiento, tipo_movimiento: e.value })}
          />
        </div>

        <div className="p-field">
          <label>Producto:</label>
          <Dropdown
            value={movimiento.producto}
            options={productos}
            optionLabel="nombre"
            placeholder="Seleccione un producto"
            onChange={(e) => setMovimiento({ ...movimiento, producto: e.value })}
          />
        </div>

        <div className="p-field">
          <label>Cantidad:</label>
          <InputNumber
            value={movimiento.cantidad ?? 0}
            onValueChange={(e) => setMovimiento({ ...movimiento, cantidad: e.value || 0 })}
          />
        </div>

        <div className="p-field">
          <label>Motivo:</label>
          <InputText
            value={movimiento.motivo}
            onChange={(e) => setMovimiento({ ...movimiento, motivo: e.target.value })}
          />
        </div>

        <div className="p-field">
          <label>Costo Unitario:</label>
          <InputNumber
            value={movimiento.costo_unitario ?? 0}
            onValueChange={(e) => setMovimiento({ ...movimiento, costo_unitario: e.value || 0 })}
          />
        </div>

        <div className="p-field">
          <label>Ubicación:</label>
          <InputText
            value={movimiento.ubicacion}
            onChange={(e) => setMovimiento({ ...movimiento, ubicacion: e.target.value })}
          />
        </div>

        <div className="p-field">
          <label>Usuario:</label>
          <InputText value={usuario?.nombre_completo || "No identificado"} readOnly />
        </div>

        <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={saveMovimiento} />
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={() => setDisplayDialog(false)} />
      </Dialog>
    </div>
  );
};
