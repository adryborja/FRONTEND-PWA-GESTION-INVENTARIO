import React from "react";
import { SupplierList } from "../components/Proveedores/SupplierList";

const Proveedores: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Proveedores</h1>
      <SupplierList />
    </div>
  );
};

export default Proveedores;
