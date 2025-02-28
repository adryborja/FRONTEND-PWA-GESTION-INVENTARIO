export interface Rol {
    id: number;
    nombre: string;
    descripcion?: string;
    fechaCreacion: string;
}

export interface Usuario {
    id: number;
    nombre_completo: string;
    email: string;
    telefono?: string;
    estado: string;
    fechaCreacion: string;
    ultimaConexion?: string;
    passwordHash: string;
    empresa?: Empresa | { id: number } | null;
    roles?: Rol[] | { id: number }[];
}

export interface Empresa {
    id: number;
    nombre: string;
    ruc: string;
    direccion: string;
    telefono: string;
    email_contacto: string;
    sector: string;
    fechaCreacion: string;
    estado: string;
}

export interface Proveedor {
    id: number;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
    fechaCreacion: string;
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    fechaCreacion: string;
}

export interface Producto {
    id: number;
    codigo_barras: string;
    nombre: string;
    descripcion: string;
    categoria?: { id: number; nombre: string } | null; 
    precio_compra: number;
    precio_venta: number;
    stock_minimo: number;
    stock_maximo: number;
    empresa?: { id: number; nombre: string } | null; 
    proveedor?: { id: number; nombre: string } | null; 
    fechaCreacion: string;
    ultimaActualizacion: string;
}

export interface Inventario {
    id: number;
    empresa?: { id: number; nombre: string } | null; 
    fecha_actualizacion: string;
}

export interface MovimientoInventario {
    id: number;
    producto?: { id: number; nombre: string } | null; 
    tipo_movimiento: "Entrada" | "Salida" | "Ajuste";
    cantidad: number;
    fecha_movimiento: string;
    motivo: string;
    usuario?: { id: number; nombre_completo: string } | null; 
    costo_unitario: number;
    ubicacion: string;
}

export interface Reporte {
    id_reporte: number;
    id_empresa: number;
    tipo: string;
    fecha_generacion: string;
    archivo_pdf: string;
    id_usuario: number;
}

export interface AlertaStock {
    id_alerta: number;
    id_producto: number;
    nivel_minimo: number;
    estado: string;
    fecha_creacion: string;
}

export interface Pedido {
    id: number;
    empresa: Empresa | null;
    fecha_solicitud: Date | string | null;
    fecha_entrega: Date | string | null;
    estado: string;
}

export interface DetallePedido {
    id: number;
    pedido?:  { id: number; nombre: string } | null; 
    producto?: { id: number; nombre: string } | null; 
    cantidad: number;
    precio_unitario: number;
}
