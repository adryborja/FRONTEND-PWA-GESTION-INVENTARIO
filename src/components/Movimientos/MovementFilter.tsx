import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

interface MovementFilterProps {
  onFilter: (filtro: { tipo_movimiento?: string }) => void;
}

export const MovementFilter: React.FC<MovementFilterProps> = ({ onFilter }) => {
  const [tipoMovimiento, setTipoMovimiento] = useState<string>("Todos");

  const tiposMovimientos = [
    { label: "Todos", value: "Todos" }, 
    { label: "Entrada", value: "Entrada" },
    { label: "Salida", value: "Salida" },
    { label: "Ajuste", value: "Ajuste" },
  ];

  const handleFilter = () => {
    onFilter({ tipo_movimiento: tipoMovimiento });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
      <Dropdown
        value={tipoMovimiento}
        options={tiposMovimientos}
        placeholder="Seleccione un tipo"
        onChange={(e) => setTipoMovimiento(e.value)}
      />
      <Button label="Filtrar" icon="pi pi-search" onClick={handleFilter} />
    </div>
  );
};

