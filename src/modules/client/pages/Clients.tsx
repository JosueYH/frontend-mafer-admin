import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { User } from "../../../types/User";
import {
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
} from "../../../services/Usuario";
import { Modal, Button, Form } from "react-bootstrap"; // Asegúrate de que react-bootstrap esté instalado

export function Clients() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPorPagina] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<Partial<User>>({});

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
        const response = await eliminarUsuario(id);
        if (response.success) {
          const updatedUsuarios = usuarios.filter(
            (usuario) => usuario.IdUser !== id
          );
          setUsuarios(updatedUsuarios);
          await Swal.fire(
            "¡Eliminado!",
            "El usuario ha sido eliminado.",
            "success"
          );
        } else {
          await Swal.fire("Error", response.msg, "error");
        }
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un error al eliminar el usuario", "error");
    }
  };

  const handleOpenModal = (usuario: User) => {
    setEditUser(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser({});
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await actualizarUsuario({
        ...editUser,
        Rol: 1,
      });
      if (response.success) {
        setUsuarios(
          usuarios.map((user) =>
            user.IdUser === editUser.IdUser ? { ...user, ...editUser } : user
          )
        );
        await Swal.fire("¡Actualizado!", response.msg, "success");
        handleCloseModal();
      } else {
        await Swal.fire("Error", response.msg, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un error al actualizar el usuario", "error");
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
              <th>Cumpleaños</th>
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
                  <td>{usuario.BirthDate}</td>
                  <td>{usuario.Password}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleOpenModal(usuario)}
                    >
                      <FaEdit />
                    </button>
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formFirstName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    value={editUser.FirstName || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, FirstName: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formLastName">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellido"
                    value={editUser.LastName || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, LastName: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formDni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DNI"
                    value={editUser.Dni || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, Dni: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formAddress">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dirección"
                    value={editUser.Address || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, Address: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={editUser.Phone || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, Phone: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formMail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={editUser.Mail || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, Mail: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={editUser.Password || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, Password: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formMail">
                  <Form.Label>Cumpleaños</Form.Label>
                  <Form.Control
                    type="date"
                    value={editUser.BirthDate || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, BirthDate: e.target.value })
                    }
                  />
                </Form.Group>
              </div>
            </div>
            <Button variant="primary" type="submit">
              Actualizar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
