import { useEffect, useRef } from "react";
import { Producto } from "../../types/types";
import { Toast } from "primereact/toast";

interface AlertsProps {
  productos: Producto[];
  calcularStock: (productoId: number) => number;
}

export const Alerts: React.FC<AlertsProps> = ({ productos, calcularStock }) => {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    verificarStockBajo();
  }, [productos]);

  const verificarStockBajo = () => {
    productos.forEach((producto) => {
      const stockActual = calcularStock(producto.id);
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

  return <Toast ref={toast} />;
};
