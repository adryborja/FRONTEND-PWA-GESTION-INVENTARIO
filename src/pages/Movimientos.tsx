import React, { useState } from "react";
import { MovementHistory } from "../components/Movimientos/MovementHistory";
import { MovementForm } from "../components/Movimientos/MovementForm";
import { MovementFilter } from "../components/Movimientos/MovementFilter";

interface FiltroMovimientos {
  tipo_movimiento?: string;
}

const Movimientos: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroMovimientos>({});

  return (
    <div>
      <h1>Gestión de Movimientos</h1>
      <MovementFilter onFilter={(nuevoFiltro) => setFiltro(nuevoFiltro)} />
      <MovementForm onSaveSuccess={() => setFiltro({ ...filtro })} />
      <MovementHistory filtro={filtro} />
    </div>
  );
};

export default Movimientos;