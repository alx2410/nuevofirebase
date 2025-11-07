import { Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Post from "./paginas/post";
import { Usuario } from "./paginas/Usuario";
import { Productos } from "./paginas/productos";
import { Inicio } from "./paginas/incio";
import Modal from "./componentes/Modal";
import Login from "./componentes/Login";
import Registro from "./componentes/Registro";
import { useState } from "react";

function App() {

  // 🔹 Un modal para Login
  const [loginModalAbierto, setLoginModalAbierto] = useState(false);
  // 🔹 Otro modal para Registro
  const [registroModalAbierto, setRegistroModalAbierto] = useState(false);

  // --- Abrir / cerrar Login ---
  const abrirLogin = () => {
    setRegistroModalAbierto(false); // por si acaso
    setLoginModalAbierto(true);
  };

  const cerrarLogin = () => {
    setLoginModalAbierto(false);
  };

  // --- Abrir / cerrar Registro ---
  const abrirRegistro = () => {
    setLoginModalAbierto(false); // por si acaso
    setRegistroModalAbierto(true);
  };

  const cerrarRegistro = () => {
    setRegistroModalAbierto(false);
  };

  // --- Callbacks de éxito ---
  const manejarLoginExitoso = () => {
    // después de loguearse → cerramos el modal de login
    setLoginModalAbierto(false);
  };

  const manejarRegistroExitoso = () => {
    // después de registrarse → cerramos registro y abrimos login
    setRegistroModalAbierto(false);
    setLoginModalAbierto(true);
  };


  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/post" element={<Post />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>




      <div className="min-h-screen bg-slate-100 flex flex-col">
       

        {/* 🔹 Modal de LOGIN */}
        {loginModalAbierto && (
          <Modal onClose={cerrarLogin}>
            <Login
              onLoginExitoso={manejarLoginExitoso}
              // desde login, si no tiene cuenta → abrimos registro
              irARegistro={() => {
                cerrarLogin();
                abrirRegistro();
              }}
            />
          </Modal>
        )}

        {/* 🔹 Modal de REGISTRO */}
        {registroModalAbierto && (
          <Modal onClose={cerrarRegistro}>
            <Registro
              onRegistroExitoso={manejarRegistroExitoso}
              // desde registro, si ya tiene cuenta → volvemos a login
              irALogin={() => {
                cerrarRegistro();
                abrirLogin();
              }}
            />
          </Modal>
        )}
      </div>


    </>






  );
}

export default App;
