import React from "react";
import { Card } from "primereact/card";
import { InventoryTable } from "../components/Inventario/InventoryTable";

export const Inventario: React.FC = () => {
  return (
    <div className="p-grid p-justify-center p-m-4">
      <div className="p-col-12">
        <h1 className="p-text-bold">Gestión de Inventario</h1> 
      </div>

      <div className="p-col-12">
        <Card>
          <InventoryTable />
        </Card>
      </div>
    </div>
  );
};

export default Inventario;
