import React from "react";

export default function Cabecera({ titulo, descripcion, mostrarDescripcion = true }) {
  return (
    <div className="card w-100 mb-3">
      <div className="card-body">
        <h1 className="card-title">{titulo}</h1>
        {mostrarDescripcion && (
          <p className="card-text">{descripcion}</p>
        )}
      </div>
    </div>
  );
}