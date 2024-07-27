import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  validateRequiredField,
  validateDNI,
  validateEmail,
  validatePhoneNumber,
} from "../../../utils/validations";
import { User } from "../../../types/User";
import { crearUsuario } from "../../../services/Usuario";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<User>>({
    Rol: 0,
  });

  const [errorMessages, setErrorMessages] = useState({
    FirstName: "",
    LastName: "",
    Dni: "",
    Address: "",
    Phone: "",
    Mail: "",
    Password: "",
    BirthDate: "",
    Rol: "",
  });

  //---------------------------------------------------------------- INPUT CHANGE
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  //---------------------------------------- VALIDATION
  const validateField = (
    name: string,
    value: string | undefined
  ): string | null => {
    switch (name) {
      case "Dni":
        return validateDNI(value) || validateRequiredField(value) || null;
      case "Mail":
        return validateEmail(value) || validateRequiredField(value) || null;
      case "Phone":
        return (
          validatePhoneNumber(value) || validateRequiredField(value) || null
        );
      default:
        return validateRequiredField(value);
    }
  };

  //---------------------------------------------------------------- POST USER
  type UserKey = keyof Partial<User>;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const requiredFields: UserKey[] = [
        "FirstName",
        "LastName",
        "Dni",
        "Address",
        "Phone",
        "Mail",
        "Password",
        "BirthDate",
      ];

      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        Swal.fire({
          title: "Error!",
          text: "Por favor complete los siguientes campos obligatorios:",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      let response: { msg: string; success: boolean };
      response = await crearUsuario(formData);
      if (response.success) {
        Swal.fire({
          title: "Correcto!",
          text: "El usuario se registró correctamente!",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        navigate("/login/");
      } else {
        Swal.fire({
          title: "Error",
          text: response.msg,
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Opps, algo salió mal!",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error("Error al registrar el nuevo usuario:", error);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper full-page">
        <div className="page-content d-flex align-items-center justify-content-center">
          <div className="row w-100 mx-0 auth-page">
            <div className="col-md-8 col-xl-6 mx-auto">
              <div className="card">
                <div className="row">
                  <div className="col-md-4 pe-md-0 d-flex align-items-center justify-content-center">
                    <div
                      className="auth-side-wrapper w-100 h-100"
                      style={{
                        backgroundImage:
                          "url(../../../../assets/img/login_bg.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "100vh",
                      }}
                    />
                  </div>
                  <div className="col-md-8 ps-md-0">
                    <div className="auth-form-wrapper px-4 py-5">
                      <a href="#" className="noble-ui-logo d-block mb-2">
                        Yogurt <span>MAFER</span>
                      </a>
                      <h5 className="text-muted fw-normal mb-4">
                        Crea una cuenta nueva.
                      </h5>
                      <form className="forms-sample" onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="FirstName" className="form-label">
                              Nombre
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="FirstName"
                              name="FirstName"
                              value={formData.FirstName || ""}
                              onChange={handleInputChange}
                              placeholder="Nombre"
                            />
                            {errorMessages.FirstName && (
                              <div className="text-danger">
                                {errorMessages.FirstName}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="LastName" className="form-label">
                              Apellido
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="LastName"
                              name="LastName"
                              value={formData.LastName || ""}
                              onChange={handleInputChange}
                              placeholder="Apellido"
                            />
                            {errorMessages.LastName && (
                              <div className="text-danger">
                                {errorMessages.LastName}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="Dni" className="form-label">
                              DNI
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="Dni"
                              name="Dni"
                              value={formData.Dni || ""}
                              onChange={handleInputChange}
                              placeholder="DNI"
                            />
                            {errorMessages.Dni && (
                              <div className="text-danger">
                                {errorMessages.Dni}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="Address" className="form-label">
                              Dirección
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="Address"
                              name="Address"
                              value={formData.Address || ""}
                              onChange={handleInputChange}
                              placeholder="Dirección"
                            />
                            {errorMessages.Address && (
                              <div className="text-danger">
                                {errorMessages.Address}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="Phone" className="form-label">
                              Teléfono
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="Phone"
                              name="Phone"
                              value={formData.Phone || ""}
                              onChange={handleInputChange}
                              placeholder="Teléfono"
                            />
                            {errorMessages.Phone && (
                              <div className="text-danger">
                                {errorMessages.Phone}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="Mail" className="form-label">
                              Correo electrónico
                            </label>
                            <input
                              type="email"
                              className="form-control form-control-lg"
                              id="Mail"
                              name="Mail"
                              value={formData.Mail || ""}
                              onChange={handleInputChange}
                              placeholder="Correo electrónico"
                            />
                            {errorMessages.Mail && (
                              <div className="text-danger">
                                {errorMessages.Mail}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="Password" className="form-label">
                              Contraseña
                            </label>
                            <input
                              type="password"
                              className="form-control form-control-lg"
                              id="Password"
                              name="Password"
                              value={formData.Password || ""}
                              onChange={handleInputChange}
                              placeholder="Contraseña"
                            />
                            {errorMessages.Password && (
                              <div className="text-danger">
                                {errorMessages.Password}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="BirthDate" className="form-label">
                              Fecha de nacimiento
                            </label>
                            <input
                              type="date"
                              className="form-control form-control-lg"
                              id="BirthDate"
                              name="BirthDate"
                              value={formData.BirthDate || ""}
                              onChange={handleInputChange}
                            />
                            {errorMessages.BirthDate && (
                              <div className="text-danger">
                                {errorMessages.BirthDate}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="btn btn-primary me-2 mb-2 mb-md-0"
                          >
                            Ingresar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-icon-text mb-2 mb-md-0"
                          >
                            <i
                              className="btn-icon-prepend"
                              data-feather="twitter"
                            />
                            Iniciar con Google
                          </button>
                        </div>
                        <NavLink
                          to="/login"
                          className="d-block mt-3 text-muted"
                        >
                          ¿Ya tienes cuenta? Inciar sesión
                        </NavLink>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
