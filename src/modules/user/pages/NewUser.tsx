import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  validateRequiredField,
  validateDNI,
  validateEmail,
  validatePhoneNumber,
} from "../../../utils/validations";
import { User } from "../../../types/User";
import { crearUsuario } from "../../../services/Usuario";

export function NewUser() {
  const navigate = useNavigate();
  const [nuevoUsuario, setNuevoUsuario] = useState<Partial<User>>({
    Rol: 0, // Rol por defecto
  });

  const [errorMessages, setErrorMessages] = useState({
    FirstName: "",
    LastName: "",
    Dni: "",
    Address: "",
    Phone: "",
    Mail: "",
    Password: "",
    Rol: "",
  });

  //---------------------------------------------------------------- INPUT CHANGE
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNuevoUsuario((prevUsuario) => ({
      ...prevUsuario,
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
  type UsuarioKey = keyof Partial<User>;
  const handleRegistrarUsuario = async () => {
    try {
      const requiredFields: UsuarioKey[] = [
        "FirstName",
        "LastName",
        "Dni",
        "Address",
        "Phone",
        "Mail",
        "Password",
      ];

      const missingFields = requiredFields.filter(
        (field) => !nuevoUsuario[field]
      );
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
      response = await crearUsuario(nuevoUsuario);
      if (response.success) {
        Swal.fire({
          title: "Correcto!",
          text: "El usuario se registró correctamente!",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        navigate("/users/");
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
        text: "Opps, algo salio mal!",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error("Error al registrar el nuevo usuario:", error);
    }
  };

  return (
    <div className="page-content">
      <nav className="page-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Usuario</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Crear nuevo usuario
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-12 stretch-card">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Registrar usuario</h6>
              <form>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <label className="form-label">Nombres</label>
                      <input
                        type="text"
                        className="form-control"
                        name="FirstName"
                        placeholder="Ingrese sus nombres"
                        onChange={handleInputChange}
                      />
                      {errorMessages.FirstName && (
                        <div className="text-danger">{errorMessages.FirstName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <label className="form-label">Apellidos</label>
                      <input
                        type="text"
                        className="form-control"
                        name="LastName"
                        placeholder="Ingrese sus apellidos"
                        onChange={handleInputChange}
                      />
                      {errorMessages.LastName && (
                        <div className="text-danger">{errorMessages.LastName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <label className="form-label">Dni</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Dni"
                        placeholder="Ingrese su dni"
                        onChange={handleInputChange}
                      />
                      {errorMessages.Dni && (
                        <div className="text-danger">{errorMessages.Dni}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <label className="form-label">Direccion</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Address"
                        placeholder="Ingrese su direccion"
                        onChange={handleInputChange}
                      />
                      {errorMessages.Address && (
                        <div className="text-danger">{errorMessages.Address}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <label className="form-label">Telefono</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Phone"
                        placeholder="Ingrese su telefono"
                        onChange={handleInputChange}
                      />
                      {errorMessages.Phone && (
                        <div className="text-danger">{errorMessages.Phone}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <label className="form-label">Correo</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Mail"
                        placeholder="Ingrese su correo"
                        onChange={handleInputChange}
                      />
                      {errorMessages.Mail && (
                        <div className="text-danger">{errorMessages.Mail}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label">Cumpleaños *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="Birthday"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        name="Password"
                        autoComplete="off"
                        placeholder="Contraseña"
                        onChange={handleInputChange}
                      />
                      {errorMessages.Password && (
                        <div className="text-danger">{errorMessages.Password}</div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              <button
                type="button"
                className="btn btn-primary submit"
                onClick={handleRegistrarUsuario}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
