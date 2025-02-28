import React, { useState, useRef } from "react";
import { OrderList } from "../components/Pedidos/OrderList";
import { OrderForm } from "../components/Pedidos/OrderForm";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export const Pedidos: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const orderListRef = useRef<any>(null);

  const handleSaveSuccess = () => {
    if (orderListRef.current) {
      orderListRef.current.loadPedidos();
    }
    setMostrarFormulario(false);
  };

  return (
    <div>
      <h1>📦 Gestión de Pedidos</h1>
      
      {/* Botón para abrir el formulario */}
      <Button 
        label="Nuevo Pedido" 
        icon="pi pi-plus" 
        className="p-button-success mb-3" 
        onClick={() => setMostrarFormulario(true)} 
      />

      {/* Componente para mostrar la lista de pedidos */}
      <OrderList ref={orderListRef} />

      {/* Diálogo para crear un nuevo pedido */}
      <Dialog 
        header="Crear Nuevo Pedido" 
        visible={mostrarFormulario} 
        style={{ width: '50vw' }}
        onHide={() => setMostrarFormulario(false)}
      >
        <OrderForm 
          onSaveSuccess={handleSaveSuccess} 
          onHide={() => setMostrarFormulario(false)} 
        />
      </Dialog>
    </div>
  );
};

export default Pedidos;