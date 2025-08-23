import React from "react";
import "./MensajeSimple.css"; // creamos este css

export default function MensajeSimple({ titulo, texto, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleOverlayClick}
    >
      <div className="modal-dialog modal-dialog-centered animar-modal">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">{titulo}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{texto}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
