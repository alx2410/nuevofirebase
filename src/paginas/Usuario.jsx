import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { onSnapshot, query, collection, addDoc } from "firebase/firestore";


export function Usuario() {

    //Variable para guardar los usuarios
    const [usuarios, setUsuarios] = useState([])
    //Variable para manejar los valores del formulario
    const [formUsuario, setFormUsuario] = useState({nombre: "",
            correo: ""
        }
    )

    useEffect(() => {
        // Creamos una consulta
        const consulta = collection(db, "usuario");
        // Escuchamos los cambios en tiempo real
        const unsubscribe = onSnapshot(consulta, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            //Actualizar post
            setUsuarios(docs)
        })

        //Limpar unsubscribe
        return () => unsubscribe()
    }, [])

    //Guardar Usuario
    const guardarUsuario = async () => {
        if (!formUsuario.nombre) return alert("no hay usuario")
        await addDoc(collection(db, "usuario"),
            {
                nombre: formUsuario.nombre,
                correo: formUsuario.correo
            }
        )
        setFormUsuario({nombre:"", correo:""});
    }


    return (
        <div>
            <h1>Usuarios</h1>
           
                <input type="text"
                    placeholder="Ingresa Nombre"
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                />

                <input type="text"
                    placeholder="Ingresa Nombre"
                    value={formUsuario.correo}
                    onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })}
                />

                <button type="button"
                    onClick={guardarUsuario}
                >
                    Agregar
                </button>

           

            <div>
                <h3>Lista de Usuarios</h3>
                <ul>
                    {usuarios.map((u) =>(
                        <li>
                            <p>{u.nombre}</p>
                            <p>{u.correo}</p>
                        </li>
                    ))
                    }
                </ul>
            </div>
        </div>
    )
}