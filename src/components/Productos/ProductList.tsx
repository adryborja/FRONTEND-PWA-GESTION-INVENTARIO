import { useEffect, useState, useRef } from "react";
import { productoService } from "../../services/productoService";
import { Producto } from "../../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProductForm } from "./ProductForm";

export const ProductList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await productoService.findAll();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los productos",
        life: 3000,
      });
    }
  };

  const deleteProducto = async (id: number) => {
    try {
      await productoService.remove(id);
      setProductos((prev) => prev.filter((producto) => producto.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Producto eliminado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el producto",
        life: 3000,
      });
    }
  };

  const handleSaveSuccess = (isEdit: boolean) => {
    loadProductos();
  
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: isEdit ? "Producto actualizado correctamente" : "Producto creado correctamente",
      life: 3000,
    });
  
    setDisplayDialog(false);
  };

  return (
    <div>
      <Toast ref={toast} />

      <Button
        label="Agregar Producto"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setSelectedProducto(null);
          setDisplayDialog(true);
        }}
      />

      <DataTable value={productos} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="codigo_barras" header="Código de Barras" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="descripcion" header="Descripción" sortable />

        {/* ✅ Ahora muestra el nombre de la categoría en lugar del ID */}
        <Column 
          header="Categoría"
          body={(rowData) => rowData.categoria?.nombre || "Sin categoría"}
          sortable
        />

        {/* ✅ Ahora muestra el nombre de la empresa en lugar del ID */}
        <Column 
          header="Empresa"
          body={(rowData) => rowData.empresa?.nombre || "Sin empresa"}
          sortable
        />

        {/* ✅ Ahora muestra el nombre del proveedor en lugar del ID */}
        <Column 
          header="Proveedor"
          body={(rowData) => rowData.proveedor?.nombre || "Sin proveedor"}
          sortable
        />

        <Column field="precio_compra" header="Precio Compra" sortable />
        <Column field="precio_venta" header="Precio Venta" sortable />
        <Column field="stock_minimo" header="Stock Mínimo" sortable />
        <Column field="stock_maximo" header="Stock Máximo" sortable />
        <Column
          header="Fecha Creación"
          body={(rowData) => new Date(rowData.fechaCreacion).toLocaleDateString()}
          sortable
        />
        <Column
          header="Acciones"
          body={(rowData: Producto) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => {
                  setSelectedProducto(rowData);
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteProducto(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog 
        header={selectedProducto ? "Editar Producto" : "Nuevo Producto"} 
        visible={displayDialog} 
        onHide={() => setDisplayDialog(false)}
      >
        <ProductForm 
          producto={selectedProducto} 
          onHide={() => setDisplayDialog(false)} 
          onSaveSuccess={handleSaveSuccess} 
        />
      </Dialog>
    </div>
  );
};