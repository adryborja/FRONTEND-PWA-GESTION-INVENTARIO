import React, { useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import { movimientoService } from "../services/movimientoService";
import { MovimientoInventario } from "../types/types";
import { Sidebar } from "../components/Sidebar";
import { Divider } from "primereact/divider";
import { Chart } from "primereact/chart";

export const Dashboard: React.FC = () => {
  const [stockData, setStockData] = useState<{ labels: string[], values: number[] }>({ labels: [], values: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productosData = await productoService.findAll();
      const movimientosData: MovimientoInventario[] = await movimientoService.findAll();

      
      const stockLabels = productosData.map((p) => p.nombre);
      const stockValues = productosData.map((p) => calcularStockDesdeInventario(p.id, movimientosData));

      setStockData({ labels: stockLabels, values: stockValues });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const calcularStockDesdeInventario = (productoId: number, movimientos: MovimientoInventario[]) => {
    const movimientosProducto = movimientos.filter((mov: MovimientoInventario) => mov.producto?.id === productoId);
    return movimientosProducto.reduce((total: number, mov: MovimientoInventario) => {
      if (mov.tipo_movimiento === "Entrada" || mov.tipo_movimiento === "Ajuste") {
        return total + mov.cantidad;
      } else if (mov.tipo_movimiento === "Salida") {
        return total - mov.cantidad;
      }
      return total;
    }, 0);
  };

  const stockChartData = {
    labels: stockData.labels,
    datasets: [
      {
        data: stockData.values,
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#D32F2F", "#7E57C2"],
        borderColor: "#fff",
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, 
      tooltip: {
        enabled: true, 
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#fff",
        font: { weight: "bold", size: 20 },
        formatter: (value: number) => value 
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#fff", font: { size: 18 } }, 
      },
      x: {
        ticks: { color: "#fff", font: { size: 18 } },
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>  
      
      <div style={{ width: "260px", height: "100vh", backgroundColor: "#1E1E2F", overflowY: "auto", padding: "15px" }}>
        <Sidebar />
      </div>

      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "30px" }}>
        <h1 style={{ fontSize: "28px" }}>📊 Panel de Control</h1>
        <p style={{ fontSize: "18px" }}>Bienvenido al sistema de gestión de inventario.</p>

        <Divider />

        
        <h2 style={{ fontSize: "24px", textAlign: "center" }}>📦 Stock de Productos</h2>
        <div style={{ width: "95%", height: "500px", margin: "auto" }}>  
          <Chart type="bar" data={stockChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
