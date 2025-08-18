export default function OpcionMultiple({ id, descripcion, opciones, valor = [], onChange }) {
  const toggleOpcion = (opcion) => {
    if (valor.includes(opcion)) {
      onChange(id, valor.filter(v => v !== opcion));
    } else {
      onChange(id, [...valor, opcion]);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{descripcion}</label>
      {opciones.map((opcion, index) => (
        <div className="form-check" key={index}>
          <input
            className="form-check-input"
            type="checkbox"
            checked={valor.includes(opcion)}
            onChange={() => toggleOpcion(opcion)}
          />
          <label className="form-check-label">{opcion}</label>
        </div>
      ))}
    </div>
  );
}
