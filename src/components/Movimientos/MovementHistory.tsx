import { useEffect, useState, useRef } from "react";
import { MovimientoInventario } from "../../types/types";
import { movimientoService } from "../../services/movimientoService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface MovementHistoryProps {
  filtro: { tipo_movimiento?: string };
}

export const MovementHistory: React.FC<MovementHistoryProps> = ({ filtro }) => {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadMovimientos();
  }, [filtro]);

  const loadMovimientos = async () => {
    try {
      const data = await movimientoService.findAll();

      // ✅ Nueva lógica de filtrado 100% funcional
      let movimientosFiltrados = data;

      // Si hay un filtro activo, lo aplicamos
      if (filtro.tipo_movimiento && filtro.tipo_movimiento !== "Todos") {
        movimientosFiltrados = data.filter((mov) => mov.tipo_movimiento === filtro.tipo_movimiento);
      }

      setMovimientos(movimientosFiltrados);
    } catch (error) {
      console.error("Error al cargar los movimientos:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los movimientos",
        life: 3000,
      });
    }
  };

  const deleteMovimiento = async (id: number) => {
    try {
      await movimientoService.remove(id);
      setMovimientos((prev) => prev.filter((mov) => mov.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Movimiento eliminado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el movimiento",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <h2>Historial de Movimientos</h2>

      <DataTable value={movimientos} paginator rows={10} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />

        <Column field="tipo_movimiento" header="Tipo de Movimiento" sortable />

        <Column field="cantidad" header="Cantidad" sortable />

        <Column header="Producto" body={(rowData) => rowData.producto?.nombre || "Desconocido"} sortable />

        <Column
          field="fecha_movimiento"
          header="Fecha"
          sortable
          body={(rowData) => new Date(rowData.fecha_movimiento).toLocaleString()}
        />

        <Column field="motivo" header="Motivo" sortable />

        <Column header="Usuario" body={(rowData) => rowData.usuario?.nombre_completo || "Desconocido"} sortable />

        <Column field="costo_unitario" header="Costo Unitario" sortable />

        <Column field="ubicacion" header="Ubicación" sortable />

        <Column
          header="Acciones"
          body={(rowData) => (
            <div>
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteMovimiento(rowData.id)} 
              />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
};
