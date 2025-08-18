export default function OpcionUnica({ id, descripcion, opciones, valor, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label">{descripcion}</label>
      {opciones.map((opcion, index) => (
        <div className="form-check" key={index}>
          <input
            className="form-check-input"
            type="radio"
            name={id}
            value={opcion}
            checked={valor === opcion}
            onChange={() => onChange(id, opcion)}
          />
          <label className="form-check-label">{opcion}</label>
        </div>
      ))}
    </div>
  );
}
