import React from "react";

export const AcercaDe: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Acerca de esta Aplicación</h1>
      <h1 className="text-2xl font-bold">Gestion de Inventario para Pymes</h1>
      <p className="mt-2">
        Esta aplicación ha sido desarrollada para gestionar el inventario en pequeñas y medianas empresas Pymes, permitiendo el control de productos,
        movimientos de stock, pedidos y proveedores de manera eficiente.
      </p>

      <h2 className="text-xl font-semibold mt-4">Tecnologías utilizadas:</h2>
      <ul className="list-disc ml-5">
        <li>React.js con TypeScript</li>
        <li>PrimeReact para los componentes UI</li>
        <li>React Router para la navegación</li>
        <li>Servicios API para la gestión de datos</li>
      </ul>

      <p className="mt-6">
        Desarrollado como parte del <strong>Proyecto Integrador de Programación Web</strong>.
      </p>

      <h3 className="text-xl font-semibold mt-4">Integrantes del Desarrollo:</h3>
      <ul className="list-disc ml-5">
        <li>Adriana Borja</li>
        <li>Camila Quirola</li>
        <li>Genesis Tito</li>
      </ul>
    </div>
  );
};

export default AcercaDe;

