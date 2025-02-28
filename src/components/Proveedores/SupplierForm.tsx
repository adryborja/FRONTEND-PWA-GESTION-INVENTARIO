import { useState, useRef, useEffect } from "react";
import { proveedorService } from "../../services/proveedorService";
import { Proveedor } from "../../types/types";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface SupplierFormProps {
  proveedor?: Proveedor | null;
  onHide: () => void;
  onSave: (isEdit: boolean) => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ proveedor, onHide, onSave }) => {
  const [proveedorData, setProveedorData] = useState<Partial<Proveedor>>({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const toast = useRef<Toast>(null);

  // ✅ Cargar datos en caso de edición o dejar en blanco si es nuevo
  useEffect(() => {
    if (proveedor) {
      setProveedorData({
        id: proveedor.id,
        nombre: proveedor.nombre || "",
        contacto: proveedor.contacto || "",
        telefono: proveedor.telefono || "",
        email: proveedor.email || "",
        direccion: proveedor.direccion || "",
      });
    } else {
      setProveedorData({
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
      });
    }
  }, [proveedor]);

  const handleSubmit = async () => {
    try {
      let isEdit = false;

      if (proveedor?.id) {
        await proveedorService.update(proveedor.id, proveedorData);
        isEdit = true;
      } else {
        await proveedorService.create(proveedorData);
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: isEdit ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente",
        life: 3000,
      });

      onSave(isEdit);
      onHide();

    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el proveedor",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="p-field">
        <label>Nombre:</label>
        <InputText 
          value={proveedorData.nombre} 
          onChange={(e) => setProveedorData({ ...proveedorData, nombre: e.target.value })} 
        />
      </div>

      <div className="p-field">
        <label>Contacto:</label>
        <InputText 
          value={proveedorData.contacto} 
          onChange={(e) => setProveedorData({ ...proveedorData, contacto: e.target.value })} 
        />
      </div>

      <div className="p-field">
        <label>Teléfono:</label>
        <InputText 
          value={proveedorData.telefono} 
          onChange={(e) => setProveedorData({ ...proveedorData, telefono: e.target.value })} 
        />
      </div>

      <div className="p-field">
        <label>Email:</label>
        <InputText 
          value={proveedorData.email} 
          onChange={(e) => setProveedorData({ ...proveedorData, email: e.target.value })} 
        />
      </div>

      <div className="p-field">
        <label>Dirección:</label>
        <InputText 
          value={proveedorData.direccion} 
          onChange={(e) => setProveedorData({ ...proveedorData, direccion: e.target.value })} 
        />
      </div>

      <div className="p-d-flex p-jc-end p-mt-3">
        <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={handleSubmit} />
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={onHide} />
      </div>
    </div>
  );
};
