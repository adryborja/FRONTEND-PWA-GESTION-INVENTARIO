import React from "react";
import { ProductList } from "../components/Productos/ProductList";

const Productos: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Productos</h1>
      <ProductList />
    </div>
  );
};

export default Productos;