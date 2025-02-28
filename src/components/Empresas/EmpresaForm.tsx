import { useState, useEffect, useRef } from "react";
import { empresaService } from "../../services/empresaService";
import { Empresa } from "../../types/types";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface EmpresaFormProps {
  empresa?: Empresa | null;
  onHide: () => void;
  onSaveSuccess: (isEdit?: boolean) => void;
}

export const EmpresaForm: React.FC<EmpresaFormProps> = ({ empresa, onHide, onSaveSuccess }) => {
  const [empresaData, setEmpresaData] = useState<Partial<Empresa>>({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email_contacto: "",
    sector: "",
    estado: "Activo",
  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (empresa) {
      setEmpresaData({
        id: empresa.id,
        nombre: empresa.nombre || "",
        ruc: empresa.ruc || "",
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        email_contacto: empresa.email_contacto || "",
        sector: empresa.sector || "",
        estado: empresa.estado || "Activo",
      });
    } else {
      setEmpresaData({
        nombre: "",
        ruc: "",
        direccion: "",
        telefono: "",
        email_contacto: "",
        sector: "",
        estado: "Activo",
      });
    }
  }, [empresa]);

  const saveEmpresa = async () => {
    try {
      let isEdit = false;
  
      if (empresa && empresa.id) {
        await empresaService.update(empresa.id, empresaData);
        isEdit = true;
      } else {
        await empresaService.create(empresaData);
      }
  
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: isEdit ? "Empresa actualizada correctamente" : "Empresa creada correctamente",
        life: 3000,
      });
  
      onSaveSuccess(isEdit); // ✅ Se pasa `isEdit` correctamente
      onHide();
  
    } catch (error) {
      console.error("Error al guardar empresa:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la empresa",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="p-field">
        <label>Nombre:</label>
        <InputText value={empresaData.nombre || ""} onChange={(e) => setEmpresaData({ ...empresaData, nombre: e.target.value })} />
      </div>

      <div className="p-field">
        <label>RUC:</label>
        <InputText value={empresaData.ruc || ""} onChange={(e) => setEmpresaData({ ...empresaData, ruc: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Dirección:</label>
        <InputText value={empresaData.direccion || ""} onChange={(e) => setEmpresaData({ ...empresaData, direccion: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Teléfono:</label>
        <InputText value={empresaData.telefono || ""} onChange={(e) => setEmpresaData({ ...empresaData, telefono: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Email de Contacto:</label>
        <InputText value={empresaData.email_contacto || ""} onChange={(e) => setEmpresaData({ ...empresaData, email_contacto: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Sector:</label>
        <InputText value={empresaData.sector || ""} onChange={(e) => setEmpresaData({ ...empresaData, sector: e.target.value })} />
      </div>

      <div className="p-field">
        <label>Estado:</label>
        <Dropdown
          value={empresaData.estado}
          options={[{ label: "Activo", value: "Activo" }, { label: "Inactivo", value: "Inactivo" }]}
          onChange={(e) => setEmpresaData({ ...empresaData, estado: e.value })}
          placeholder="Seleccione el estado"
        />
      </div>

      <div className="p-d-flex p-jc-end p-mt-3">
        <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={saveEmpresa} />
        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onHide} />
        
      </div>
    </div>
  );
};
