import { useEffect, useState, useRef } from "react";
import { categoriaService } from "../services/categoriaService";
import { Categoria } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [categoriaData, setCategoriaData] = useState<Partial<Categoria>>({
    nombre: "",
    descripcion: "",
  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.findAll();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las categorías",
        life: 3000,
      });
    }
  };

  const saveCategoria = async () => {
    try {
      let isEdit = false;

      if (selectedCategoria?.id) {
        await categoriaService.update(selectedCategoria.id, categoriaData);
        isEdit = true;
      } else {
        await categoriaService.create(categoriaData);
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: isEdit ? "Categoría actualizada correctamente" : "Categoría creada correctamente",
        life: 3000,
      });

      setDisplayDialog(false);
      loadCategorias(); 
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la categoría",
        life: 3000,
      });
    }
  };

  const deleteCategoria = async (id: number) => {
    try {
      await categoriaService.remove(id);
      setCategorias((prevCategorias) => prevCategorias.filter((categoria) => categoria.id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoría eliminada correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la categoría",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <h1>Gestión de Categorías</h1>
      <Toast ref={toast} />

      
      <Button
        label="Agregar Categoría"
        icon="pi pi-plus"
        className="p-button-success p-mb-3"
        onClick={() => {
          setSelectedCategoria(null);
          setCategoriaData({ nombre: "", descripcion: "" }); 
          setDisplayDialog(true);
        }}
      />

      <DataTable value={categorias} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="descripcion" header="Descripción" sortable />
        <Column
          field="fechaCreacion"
          header="Fecha de Creación"
          sortable
          body={(rowData) => new Date(rowData.fechaCreacion).toLocaleDateString()}
        />
        <Column
          header="Acciones"
          body={(rowData: Categoria) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => {
                  setSelectedCategoria(rowData);
                  setCategoriaData({ nombre: rowData.nombre, descripcion: rowData.descripcion });
                  setDisplayDialog(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteCategoria(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      
      <Dialog
        header={selectedCategoria ? "Editar Categoría" : "Nueva Categoría"}
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)}
      >
        <div>
          <div className="p-field">
            <label>Nombre:</label>
            <InputText
              value={categoriaData.nombre || ""}
              onChange={(e) => setCategoriaData({ ...categoriaData, nombre: e.target.value })}
            />
          </div>

          <div className="p-field">
            <label>Descripción:</label>
            <InputText
              value={categoriaData.descripcion || ""}
              onChange={(e) => setCategoriaData({ ...categoriaData, descripcion: e.target.value })}
            />
          </div>

          <div className="p-d-flex p-jc-end p-mt-3">
            <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={saveCategoria} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={() => setDisplayDialog(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Categorias;
