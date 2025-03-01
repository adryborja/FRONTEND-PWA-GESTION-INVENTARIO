import React from "react";
import { OrderList } from "../components/Pedidos/OrderList";
import { DetailList } from "../components/Pedidos/DetailList";

const Pedidos: React.FC = () => {
  return (
    <div>
      <h1>📦 Gestión de Pedidos</h1>
      <OrderList />
      <DetailList />
    </div>
  );
};

export default Pedidos;
