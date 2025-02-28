import { useEffect, useState } from "react";
import { categoriaService } from "../../services/categoriaService";
import { Categoria } from "../../types/types";
import { Dropdown } from "primereact/dropdown";

interface CategorySelectorProps {
  selectedCategory: number | null;
  onSelect: (id: number) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.findAll();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  return (
    <Dropdown
      value={selectedCategory}
      options={categorias}
      optionLabel="nombre"
      placeholder="Seleccione una categoría"
      onChange={(e) => onSelect(e.value)}
    />
  );
};
