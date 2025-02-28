import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-grid p-justify-center p-m-4">
      <div className="p-col-10">
        <Card title="Bienvenido al Sistema de Gestión de Inventario">
          <p>
            Este sistema te permite gestionar usuarios, productos, inventarios, pedidos y proveedores de manera eficiente.
          </p>
          <div className="p-mt-4">
            <Button 
              label="Iniciar Sesión" 
              icon="pi pi-sign-in" 
              className="p-button-primary p-mr-2" 
              onClick={() => navigate("/login")} 
            />
            <Button 
              label="Registrarse" 
              icon="pi pi-user-plus" 
              className="p-button-secondary" 
              onClick={() => navigate("/register")} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
