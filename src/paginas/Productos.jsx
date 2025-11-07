import React from 'react'
import { FormProducto } from '../componentes/FormProducto'
import { ListProducto } from '../componentes/ListProducto'

export function Productos() {

    return (
        <div>
            <h1>Gestión de Productos</h1>
            <FormProducto />
            <ListProducto />
        </div>
    )
}