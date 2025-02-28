import React from "react";
import { useNavigate } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import { useAuth } from "../context/AuthProvider";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  if (!auth) {
    return null;
  }

  const { usuario, logout } = auth;
  const isAuthenticatedUser = !!usuario;
  const userName = usuario?.nombre_completo || "Usuario Desconocido";
  const isAdmin = usuario?.roles?.some((rol) => {
    return typeof rol === "object" && "nombre" in rol && rol.nombre === "Administrador";
  });

  const items = [
    { label: "Dashboard", icon: "pi pi-chart-line", command: () => navigate("/dashboard") },
    { label: "Empresas", icon: "pi pi-building", command: () => navigate("/empresas") },
    ...(isAdmin ? [{
      label: "Gestión de Usuarios",
      icon: "pi pi-user",
      items: [
        { label: "Usuarios", icon: "pi pi-users", command: () => navigate("/usuarios") },
        { label: "Roles", icon: "pi pi-id-card", command: () => navigate("/roles") }
      ]
    }] : []),
    {
      label: "Productos e Inventario",
      icon: "pi pi-box",
      items: [
        { label: "Productos", icon: "pi pi-box", command: () => navigate("/productos") },
        { label: "Categorías", icon: "pi pi-list", command: () => navigate("/categorias") },
        { label: "Inventario", icon: "pi pi-list", command: () => navigate("/inventario") }
      ]
    },
    { label: "Movimientos", icon: "pi pi-exchange", command: () => navigate("/movimientos") },
    {
      label: "Pedidos y Proveedores",
      icon: "pi pi-shopping-cart",
      items: [
        { label: "Pedidos", icon: "pi pi-shopping-cart", command: () => navigate("/pedidos") },
        { label: "Proveedores", icon: "pi pi-truck", command: () => navigate("/proveedores") }
      ]
    },
    { label: "Acerca de", icon: "pi pi-info-circle", command: () => navigate("/acerca-de") }
  ];

  return (
    <div className="sidebar-container" style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#1E1E2F", padding: "15px" }}>
      {/* ✅ Sección del usuario en la parte superior */}
      {isAuthenticatedUser && (
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <Avatar icon="pi pi-user" size="large" shape="circle" style={{ marginBottom: "10px" }} />
          <h3 style={{ color: "#fff" }}>{userName}</h3>
          <Button label="Cerrar Sesión" icon="pi pi-sign-out" className="p-button-danger p-button-text" onClick={logout} />
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        <PanelMenu model={items} />
      </div>
    </div>
  );
};
