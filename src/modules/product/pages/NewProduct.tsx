import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { addProduct } from "../../../services/Product";

const acceptTypes = {
  "image/*": [],
};

interface FormData {
  name: string;
  description: string;
  nutritionalInfo: string;
  category: string;
  price: string;
  stock: string;
  image: File | null;
}

const NewProduct: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    nutritionalInfo: "",
    category: "",
    price: "",
    stock: "",
    image: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {
      name: "",
      description: "",
      nutritionalInfo: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    }
  );

  const handleDrop = (acceptedFiles: File[]) => {
    setFormData({ ...formData, image: acceptedFiles[0] });
    setErrors({ ...errors, image: "" });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: acceptTypes,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); 
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    for (const key in formData) {
      if (
        formData[key as keyof FormData] === "" ||
        formData[key as keyof FormData] === null
      ) {
        newErrors[key as keyof FormData] = "Este campo es obligatorio";
        isValid = false;
      }
    }

    if (formData.image === null) {
      newErrors.image = "Selecciona una imagen";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    data.append("Name", formData.name);
    data.append("Description", formData.description);
    data.append("NutritionalInformation", formData.nutritionalInfo);
    data.append("Category", formData.category);
    data.append("Price", formData.price);
    data.append("Stock", formData.stock);
    if (formData.image) {
      data.append("file", formData.image);
    }

    try {
      console.log(data);
      const response = await addProduct(data);
      if (response.success) {
        Swal.fire({
          title: "Éxito",
          text: response.msg,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setFormData({
          name: "",
          description: "",
          nutritionalInfo: "",
          category: "",
          price: "",
          stock: "",
          image: null,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.msg,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as Error).message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  useEffect(() => {
    const scriptPaths = [
      "../assets/vendors/dropify/dist/dropify.min.js",
      "../assets/js/dropify.js",
    ];

    const loadScript = (path: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = path;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${path}`));
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      for (const scriptPath of scriptPaths) {
        try {
          await loadScript(scriptPath);
        } catch (error) {
          console.error(error);
        }
      }
      console.log("All scripts loaded successfully.");
    };

    loadScripts();
  }, []);

  return (
    <div className="page-content">
      <nav className="page-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Producto</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Nuevo Producto
          </li>
        </ol>
      </nav>
      <div className="row">
        <div className="col-lg-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Crear un producto</h4>
              <form id="signupForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    id="name"
                    className="form-control"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger mt-1">{errors.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  {errors.description && (
                    <div className="text-danger mt-1">{errors.description}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="nutritionalInfo" className="form-label">
                    Información nutricional
                  </label>
                  <input
                    id="nutritionalInfo"
                    className="form-control"
                    name="nutritionalInfo"
                    type="text"
                    value={formData.nutritionalInfo}
                    onChange={handleChange}
                  />
                  {errors.nutritionalInfo && (
                    <div className="text-danger mt-1">
                      {errors.nutritionalInfo}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Categoría
                  </label>
                  <select
                    className="form-select"
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Selecciona una categoría
                    </option>
                    <option value="Yogurt">Yogurt</option>
                    <option value="Mermelada">Mermelada</option>
                  </select>
                  {errors.category && (
                    <div className="text-danger mt-1">{errors.category}</div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form id="signupForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Precio
                  </label>
                  <input
                    id="price"
                    className="form-control"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <div className="text-danger mt-1">{errors.price}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    id="stock"
                    className="form-control"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                  {errors.stock && (
                    <div className="text-danger mt-1">{errors.stock}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Agrega una imagen</label>
                  <div
                    {...getRootProps({
                      className: "dropzone",
                      style: {
                        border: "2px dashed #ddd",
                        borderRadius: "4px",
                        padding: "20px",
                        cursor: "pointer",
                      },
                    })}
                  >
                    <input {...getInputProps()} />
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Vista previa"
                        style={{ maxWidth: "100%", maxHeight: "150px" }}
                      />
                    ) : (
                      <p>Arrastra una imagen o haz clic para seleccionar</p>
                    )}
                    {errors.image && (
                      <div className="text-danger mt-1">{errors.image}</div>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4">
                  Crear producto
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
