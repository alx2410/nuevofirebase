// src/SubirImagen.jsx
import { useState, useEffect } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function Productos() {
  const [imagen, setImagen] = useState(null);      // archivo seleccionado
  const [url, setUrl] = useState("");              // URL de la imagen
  const [subiendo, setSubiendo] = useState(false); // estado de carga

  // 🔹 Al cargar la página, buscamos si hay una imagen guardada
  useEffect(() => {
    const imagenGuardada = localStorage.getItem("imagenURL");
    if (imagenGuardada) setUrl(imagenGuardada);
  }, []);

  const subirImagen = async () => {
    if (!imagen) return alert("Primero selecciona una imagen");
    setSubiendo(true);

    // 1️⃣ Crear referencia en Storage
    const imagenRef = ref(storage, `imagenes/${imagen.name}`);

    // 2️⃣ Subir imagen
    await uploadBytes(imagenRef, imagen);

    // 3️⃣ Obtener URL pública
    const urlDescarga = await getDownloadURL(imagenRef);

    // 4️⃣ Guardar en estado y en localStorage
    setUrl(urlDescarga);
    localStorage.setItem("imagenURL", urlDescarga);

    setSubiendo(false);
  };

  const eliminarImagen = () => {
    localStorage.removeItem("imagenURL");
    setUrl("");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Subir Imagen a Firebase Storage</h2>

      {/* Selector de archivo */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagen(e.target.files[0])}
        id="selector-imagen"
        className="hidden"
      />

      {/* Botón para subir */}
      <label
        onClick={subirImagen}
        htmlFor="selector-imagen"
        disabled={subiendo}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {subiendo ? "Subiendo..." : "Subir Imagen"}
      </label>

      {/* Mostrar imagen si existe */}
      {url && (
        <div className="mt-6 text-center">
          <p className="mb-2 font-semibold">Vista previa:</p>
          <img
            src={url}
            alt="Imagen subida"
            className="w-64 h-64 object-cover rounded shadow mb-4"
          />
          <button
            onClick={eliminarImagen}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Eliminar Imagen Guardada
          </button>
        </div>
      )}
    </div>
  );
}
