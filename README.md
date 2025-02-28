# **Proyecto Integrador - Sistema de Gestión de Inventarios**
Realizado por: Adriana Borja, Camila Quirola, Genesis Tito

## **Descripción del Proyecto**
Este proyecto es un **Sistema de Gestión de Inventarios** desarrollado como parte del **Proyecto Integrador del Segundo Parcial**. El objetivo principal es administrar el inventario de productos, permitiendo el control de **entradas y salidas**, gestión de **usuarios** y generación de **reportes**.

## **Características Principales**
- **Gestión de Usuarios y Roles** (Administrador, Empleado, Supervisor, Auditor).
- **Control de Inventarios** con alertas de stock mínimo.
- **Manejo de Productos y Categorías** para clasificación eficiente.
- **Registro de Movimientos de Inventario** (entradas, salidas y ajustes).
- **Gestión de Empresas y Proveedores**.
- **Generación de Reportes** en formato PDF.

## **Tecnologías Utilizadas**
### **Backend (NestJS)**
- **NestJS** - Framework de Node.js para el backend.
- **PostgreSQL** - Base de datos relacional.
- **TypeORM** - ORM para gestionar la base de datos.

## **Estructura del Proyecto**
### **Backend**
El backend sigue una estructura modular en NestJS, con los siguientes módulos:
- **Empresa**: Administración de empresas registradas.
- **Usuario**: Gestión de usuarios del sistema.
- **Rol**: Definición y asignación de roles a usuarios.
- **Producto**: Registro y control de productos.
- **Categoría**: Clasificación de productos.
- **Inventario**: Control de stock y niveles de alerta.
- **Movimiento de Inventario**: Registro de entradas, salidas y ajustes.
- **Reportes**: Generación de informes de inventario y movimientos.

### **Frontend**
El frontend está estructurado en **componentes reutilizables**, incluyendo:
- **Autenticación**: Login y registro de usuarios.
- **Dashboard**: Panel de control con estadísticas generales.
- **Gestión de Usuarios**: Administración de usuarios y roles.
- **Gestión de Productos**: Creación y actualización de productos.
- **Gestión de Inventarios**: Control y actualización del stock.
- **Movimientos de Inventario**: Historial de cambios en el inventario.
- **Pedidos y Proveedores**: Módulo de órdenes de compra y proveedores.

## **Instalación y Configuración**
### **Requisitos Previos**
- **Node.js y npm**
- **PostgreSQL**
- **NestJS CLI**

### **Clonar el Repositorio**

- git clone https://github.com/adryborja/frontend-pwa-inventarios.git
- git clone https://github.com/adryborja/backend-pwa-inventarios.git

### **Configurar backend**

# Instalar dependencias
- npm i -g @nestjs/cli  
- npm install --save @nestjs/typeorm typeorm pg
- npm run start

### **Configurar frontend**

# Instalar dependencias
- npm install primereact primeicons primeflex react-router-dom
- npm run dev
