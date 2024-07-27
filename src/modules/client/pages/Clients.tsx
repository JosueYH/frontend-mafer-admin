import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

import { User } from "../../../types/User";
import { obtenerUsuarios, eliminarUsuario } from "../../../services/Usuario";

export function Clients() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPorPagina] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  const indexOfLastUsuario = currentPage * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
  const currentUsuarios = usuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario
  );

  const filteredUsuarios = currentUsuarios.filter((usuario) =>
    Object.values(usuario).some((value) =>
      (value ? value.toString().toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      )
    )
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await obtenerUsuarios();
        data = data.filter((usuario: User) => usuario.Rol == 1);
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchData();
  }, []);

  const handleEliminarUsuario = async (id: number) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, elimínalo",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        await eliminarUsuario(id);
        const updatedUsuarios = usuarios.filter(
          (usuario) => usuario.IdUser !== id
        );
        setUsuarios(updatedUsuarios);
        await Swal.fire(
          "¡Eliminado!",
          "El usuario ha sido eliminado.",
          "success"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un error al eliminar el usuario", "error");
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
            Usuarios
          </li>
        </ol>
      </nav>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table
          id="example"
          className="table table-striped table-bordered"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Nombres y apellidos</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Email</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario, index) => (
                <tr key={index}>
                  <td>{usuario.FirstName + " " + usuario.LastName}</td>
                  <td>{usuario.Dni}</td>
                  <td>{usuario.Phone}</td>
                  <td>{usuario.Address}</td>
                  <td>{usuario.Mail}</td>
                  <td>{usuario.Password}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminarUsuario(usuario.IdUser || 0)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className="pagination justify-content-center">
        {Array.from(
          { length: Math.ceil(usuarios.length / usuariosPorPagina) },
          (_, index) => (
            <li key={index} className="page-item">
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
