import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Product } from "../../../types/Product";
import {
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "../../../services/Product";
import "./Products.css";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (currentProduct && currentProduct.UrlImage) {
      setImagePreview(currentProduct.UrlImage); // Set initial image preview
    }
  }, [currentProduct]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar los productos", "error");
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        if (productId) {
          const response = await deleteProduct(productId);
          if (response.success) {
            Swal.fire("¡Producto eliminado!", response.msg, "success");
            loadProducts();
          } else {
            Swal.fire("Error", response.msg, "error");
          }
        }
      }
    } catch (error) {
      Swal.fire("Error", "Oppss, algo salio mal!", "error");
    }
  };

  const handleCloseModal = () => setShowEditModal(false);

  const handleSaveChanges = async () => {
    if (!currentProduct) return;

    try {
      const formData = new FormData();
      formData.append("Name", currentProduct.Name);
      formData.append("Description", currentProduct.Description);
      formData.append(
        "NutritionalInformation",
        currentProduct.NutritionalInformation
      );
      formData.append("Price", currentProduct.Price.toString());
      formData.append("Stock", currentProduct.Stock.toString());

      if (file) {
        formData.append("file", file);
      }
      const response = await updateProduct(formData);

      if (response.success) {
        Swal.fire("Éxito", response.msg, "success");
        loadProducts();
        handleCloseModal();
      } else {
        Swal.fire("Error", response.msg, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Oppss, algo salio mal!", "error");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div className="page-content">
      <nav className="page-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Producto</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Lista de productos
          </li>
        </ol>
      </nav>
      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 product-grid">
          {products.map((product) => (
            <div key={product.IdProduct} className="col">
              <div className="card">
                <img
                  src={product.UrlImage}
                  className="card-img-top"
                  alt={product.Name}
                />
                <div className="card-body" style={{ border: "none" }}>
                  <h6
                    className="card-title cursor-pointer"
                    style={{ color: "#C84751" }}
                  >
                    {product.Name}
                  </h6>
                  <p className="my-4">{product.NutritionalInformation}</p>
                  <div className="clearfix">
                    <p className="mb-0 float-start">
                      <strong>Stock:</strong> {product.Stock}
                    </p>
                    <p className="mb-0 float-end fw-bold">s./{product.Price}</p>
                  </div>
                  <Button variant="primary" onClick={() => handleEdit(product)}>
                    Editar
                  </Button>
                  <Button
                    variant=""
                    className="ms-2"
                    onClick={() => handleDelete(product.IdProduct)}
                    style={{
                      borderColor: "#C84751",
                      borderWidth: "2px",
                      backgroundColor: "transparent",
                      color: "#C84751",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#C84751")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal show={showEditModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentProduct && (
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre
                    </label>
                    <input
                      id="name"
                      className="form-control"
                      name="Name"
                      type="text"
                      value={currentProduct.Name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      name="Description"
                      value={currentProduct.Description}
                      onChange={handleChange}
                      style={{ height: "90px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="nutritionalInformation"
                      className="form-label"
                    >
                      Información Nutricional
                    </label>
                    <textarea
                      id="nutritionalInformation"
                      className="form-control"
                      name="NutritionalInformation"
                      value={currentProduct.NutritionalInformation}
                      onChange={handleChange}
                      style={{ height: "90px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Precio
                    </label>
                    <input
                      id="price"
                      className="form-control"
                      name="Price"
                      type="number"
                      value={currentProduct.Price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">
                      Stock
                    </label>
                    <input
                      id="stock"
                      className="form-control"
                      name="Stock"
                      type="number"
                      value={currentProduct.Stock}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                      Imagen
                    </label>
                    {imagePreview && (
                      <div className="mb-2">
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                    <input
                      id="file"
                      className="form-control"
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Products;
