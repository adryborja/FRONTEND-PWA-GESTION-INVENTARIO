import { useState, useEffect, useRef } from "react";
import { Producto, Empresa, Proveedor, Categoria } from "../../types/types";
import { productoService } from "../../services/productoService";
import { empresaService } from "../../services/empresaService";
import { proveedorService } from "../../services/proveedorService";
import { categoriaService } from "../../services/categoriaService";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface ProductFormProps {
  producto?: Producto | null;
  onHide: () => void;
  onSaveSuccess: (isEdit: boolean) => void; 
}

export const ProductForm: React.FC<ProductFormProps> = ({ producto, onHide, onSaveSuccess }) => {
  const [productData, setProductData] = useState<Partial<Producto>>({
    codigo_barras: "",
    nombre: "",
    descripcion: "",
    precio_compra: 0,
    precio_venta: 0,
    stock_minimo: 0,
    stock_maximo: 0,
    categoria: null,
    empresa: null,
    proveedor: null,
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadCategorias();
    loadEmpresas();
    loadProveedores();
  }, []);

  useEffect(() => {
    if (producto) {
      setProductData({
        id: producto.id,
        codigo_barras: producto.codigo_barras || "",
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio_compra: producto.precio_compra || 0,
        precio_venta: producto.precio_venta || 0,
        stock_minimo: producto.stock_minimo || 0,
        stock_maximo: producto.stock_maximo || 0,
        categoria: producto.categoria ? { id: producto.categoria.id, nombre: producto.categoria.nombre } : null,
        empresa: producto.empresa ? { id: producto.empresa.id, nombre: producto.empresa.nombre } : null,
        proveedor: producto.proveedor ? { id: producto.proveedor.id, nombre: producto.proveedor.nombre } : null,
      });
    } else {
      setProductData({
        codigo_barras: "",
        nombre: "",
        descripcion: "",
        precio_compra: 0,
        precio_venta: 0,
        stock_minimo: 0,
        stock_maximo: 0,
        categoria: null,
        empresa: null,
        proveedor: null,
      });
    }
  }, [producto]);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.findAll();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const loadEmpresas = async () => {
    try {
      const data = await empresaService.findAll();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  };

  const loadProveedores = async () => {
    try {
      const data = await proveedorService.findAll();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  const saveProducto = async () => {
    try {
      const payload: Partial<Producto> = {
        ...productData,
        categoria: productData.categoria ? { id: productData.categoria.id, nombre: productData.categoria.nombre } : null,
        empresa: productData.empresa ? { id: productData.empresa.id, nombre: productData.empresa.nombre } : null,
        proveedor: productData.proveedor ? { id: productData.proveedor.id, nombre: productData.proveedor.nombre } : null,
      };
  
      let isEdit = false;
  
      if (productData.id) {
        await productoService.update(productData.id, payload);
        isEdit = true;
      } else {
        await productoService.create(payload);
      }
  
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: isEdit ? "Producto actualizado correctamente" : "Producto creado correctamente",
        life: 3000,
      });
  
      onSaveSuccess(isEdit);
      onHide();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el producto",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="p-field">
        <label>Código de Barras:</label>
        <InputText value={productData.codigo_barras} onChange={(e) => setProductData({ ...productData, codigo_barras: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Nombre:</label>
        <InputText value={productData.nombre} onChange={(e) => setProductData({ ...productData, nombre: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Descripción:</label>
        <InputText value={productData.descripcion} onChange={(e) => setProductData({ ...productData, descripcion: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Precio Compra:</label>
        <InputNumber value={productData.precio_compra} onValueChange={(e) => setProductData({ ...productData, precio_compra: e.value || 0 })} />
      </div>

      <div className="p-field">
        <label>Precio Venta:</label>
        <InputNumber value={productData.precio_venta} onValueChange={(e) => setProductData({ ...productData, precio_venta: e.value || 0 })} />
      </div>

      <div className="p-field">
        <label>Stock Mínimo:</label>
        <InputNumber value={productData.stock_minimo} onValueChange={(e) => setProductData({ ...productData, stock_minimo: e.value || 0 })} />
      </div>

      <div className="p-field">
        <label>Stock Máximo:</label>
        <InputNumber value={productData.stock_maximo} onValueChange={(e) => setProductData({ ...productData, stock_maximo: e.value || 0 })} />
      </div>

      <div className="p-field">
        <label>Categoría:</label>
        <Dropdown value={productData.categoria} options={categorias} optionLabel="nombre" placeholder="Seleccione una categoría" onChange={(e) => setProductData({ ...productData, categoria: e.value })} />
      </div>

      <div className="p-field">
        <label>Empresa:</label>
        <Dropdown value={productData.empresa} options={empresas} optionLabel="nombre" placeholder="Seleccione una empresa" onChange={(e) => setProductData({ ...productData, empresa: e.value })} />
      </div>

      <div className="p-field">
        <label>Proveedor:</label>
        <Dropdown value={productData.proveedor} options={proveedores} optionLabel="nombre" placeholder="Seleccione un proveedor" onChange={(e) => setProductData({ ...productData, proveedor: e.value })} />
      </div>

      <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={saveProducto} />
      <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={onHide} />
    </div>
  ); 
};
