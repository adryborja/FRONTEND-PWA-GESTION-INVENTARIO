import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu"; 
import { useAuth } from "../context/AuthProvider";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const menuRef = useRef<Menu>(null); 

  if (!auth) {
    return null; 
  }

  const { usuario, logout } = auth;
  const isAuthenticatedUser = !!usuario;
  const userName = usuario?.nombre_completo || "Usuario Desconocido";


  const isAdmin = usuario?.roles?.some((rol) => {
    return typeof rol === "object" && "nombre" in rol && rol.nombre === "Administrador";
  });

  // Configuración del menú
  let items = [];

  if (!isAuthenticatedUser) {
    items = [
      { label: "Inicio", icon: "pi pi-home", command: () => navigate("/") },
      { label: "Acerca de", icon: "pi pi-info-circle", command: () => navigate("/acerca-de") },
    ];
  } else {
    items = [
      { label: "Empresas", icon: "pi pi-building", command: () => navigate("/empresas") },
      { label: "Categorías", icon: "pi pi-box", command: () => navigate("/categorias") },
      { label: "Productos", icon: "pi pi-box", command: () => navigate("/productos") },
      { label: "Inventario", icon: "pi pi-list", command: () => navigate("/inventario") },
      { label: "Movimientos", icon: "pi pi-list", command: () => navigate("/movimientos") },
      { label: "Pedidos", icon: "pi pi-shopping-cart", command: () => navigate("/pedidos") },
      { label: "Proveedores", icon: "pi pi-truck", command: () => navigate("/proveedores") },
      { label: "Acerca de", icon: "pi pi-info-circle", command: () => navigate("/acerca-de") },
      { label: "DashBoard", icon: "pi pi-info-circle", command: () => navigate("/dashboard") },
    ];

    if (isAdmin) {
      items.unshift(
        { label: "Usuarios", icon: "pi pi-user", command: () => navigate("/usuarios") },
        { label: "Roles", icon: "pi pi-users", command: () => navigate("/roles") }
      );
    }
  }

  // Configuración del menú desplegable del usuario
  const userMenuItems = [
    { label: "Cerrar Sesión", icon: "pi pi-sign-out", command: logout },
  ];

  return (
    <div className="navbar-container">
      <Menubar 
        model={items} 
        end={isAuthenticatedUser && (
          <div className="p-d-flex p-ai-center">
            {/* 🔹 Menú Desplegable del Usuario */}
            <Menu model={userMenuItems} popup ref={menuRef} />
            <span 
              className="p-mr-2 p-d-flex p-ai-center p-cursor-pointer" 
              onClick={(e) => menuRef.current?.toggle(e)}
            >
              <i className="pi pi-user p-mr-1" /> {userName}
            </span>
          </div>
        )} 
      />
    </div>
  );
};
