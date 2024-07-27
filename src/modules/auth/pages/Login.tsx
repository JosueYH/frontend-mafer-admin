import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../../../services/Login";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  //---------------------------------------------------------------- POST LOGIN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({
        UserRequest: username,
        Password: password,
      });
      if (!response.success) {
        Swal.fire({
          title: "Error!",
          text: response.msg,
          icon: "error",
          confirmButtonText: "Aceptar",
        });

      } else {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("isAuthenticated", "true");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Bienvenido ${response.data.FirstName}`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Oppss, algo salio mal!",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
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
                        ¡Bienvenido de nuevo! Ingrese a su cuenta.
                      </h5>
                      <form className="forms-sample" onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="userEmail" className="form-label">
                            Correo electrónico
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="userEmail"
                            placeholder="Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="userPassword" className="form-label">
                            Contraseña
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="userPassword"
                            autoComplete="current-password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Ocultar" : "Mostrar"} contraseña
                          </button>
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
                          to="/register"
                          className="d-block mt-3 text-muted"
                        >
                          ¿No eres usuario? Regístrate
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
