import React from "react";
import { UserList } from "../components/Usuarios/UserList";


export const Usuarios: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserList />
    </div>
  );
};

export default Usuarios;
