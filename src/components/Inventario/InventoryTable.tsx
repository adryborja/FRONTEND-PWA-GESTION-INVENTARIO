import { useEffect, useState, useRef } from "react";
import { productoService } from "../../services/productoService";
import { movimientoService } from "../../services/movimientoService";
import { Producto, MovimientoInventario } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InventoryUpdate } from "./InventoryUpdate";

export const InventoryTable: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [updateType, setUpdateType] = useState<"minimo" | "maximo" | null>(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displaySelectionDialog, setDisplaySelectionDialog] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadProductos();
    loadMovimientos();
  }, []);

  useEffect(() => {
    if (movimientos.length > 0) {
      verificarStockBajo();
    }
  }, [productos, movimientos]); // ✅ Se ejecuta solo después de que los movimientos están cargados

  const loadProductos = async () => {
    try {
      const data = await productoService.findAll();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "Error al cargar los productos", life: 3000 });
    }
  };

  const loadMovimientos = async () => {
    try {
      const data = await movimientoService.findAll();
      setMovimientos(data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "Error al cargar los movimientos", life: 3000 });
    }
  };

  const calcularStock = (productoId: number) => {
    const movimientosProducto = movimientos.filter((mov) => mov.producto?.id === productoId);
    return movimientosProducto.reduce((total, mov) => {
      if (mov.tipo_movimiento === "Entrada" || mov.tipo_movimiento === "Ajuste") {
        return total + mov.cantidad;
      } else if (mov.tipo_movimiento === "Salida") {
        return total - mov.cantidad;
      }
      return total;
    }, 0);
  };

  const verificarStockBajo = () => {
    productos.forEach((producto) => {
      const stockActual = calcularStock(producto.id);
      console.log(`🔍 Producto: ${producto.nombre}, Stock Actual: ${stockActual}, Stock Mínimo: ${producto.stock_minimo}`);

      if (stockActual < producto.stock_minimo) {
        toast.current?.show({
          severity: "warn",
          summary: "⚠️ Stock Bajo",
          detail: `El producto "${producto.nombre}" tiene un stock de ${stockActual}, por debajo del mínimo (${producto.stock_minimo}).`,
          life: 5000,
        });
      }
    });
  };

  return (
    <div>
      <Toast ref={toast} />

      <DataTable value={productos} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" />
        <Column field="nombre" header="Producto" />
        <Column header="Empresa" body={(rowData: Producto) => rowData.empresa?.nombre || "Sin empresa"} sortable />
        <Column field="stock_minimo" header="Stock Mínimo" />
        <Column field="stock_maximo" header="Stock Máximo" />
        <Column header="Stock Actual" body={(rowData: Producto) => calcularStock(rowData.id)} sortable />

        <Column
          header="Actualizar Stock"
          body={(rowData: Producto) => (
            <Button
              icon="pi pi-refresh"
              className="p-button-rounded p-button-info"
              onClick={() => {
                setSelectedProducto(rowData);
                setDisplaySelectionDialog(true);
              }}
            />
          )}
        />
      </DataTable>

      {/* ✅ Diálogo para seleccionar si actualizar Stock Mínimo o Máximo */}
      <Dialog 
        header="Seleccionar Tipo de Actualización" 
        visible={displaySelectionDialog} 
        onHide={() => setDisplaySelectionDialog(false)}
      >
        <p>¿Qué tipo de stock deseas actualizar?</p>
        <div className="p-d-flex p-jc-between">
          <Button label="Stock Mínimo" className="p-button-primary" onClick={() => { 
            setUpdateType("minimo"); 
            setDisplaySelectionDialog(false);
            setDisplayDialog(true);
          }} />
          <Button label="Stock Máximo" className="p-button-secondary" onClick={() => { 
            setUpdateType("maximo"); 
            setDisplaySelectionDialog(false);
            setDisplayDialog(true);
          }} />
        </div>
      </Dialog>

      {/* ✅ Diálogo de actualización de stock */}
      <Dialog 
        header={`Actualizar ${updateType === "minimo" ? "Stock Mínimo" : "Stock Máximo"}`} 
        visible={displayDialog} 
        onHide={() => setDisplayDialog(false)}
      >
        {selectedProducto && updateType && (
          <InventoryUpdate
            producto={selectedProducto}
            updateType={updateType}
            onHide={() => {
              setDisplayDialog(false);
              loadProductos();
              loadMovimientos();
            }}
          />
        )}
      </Dialog>
    </div>
  );
};
