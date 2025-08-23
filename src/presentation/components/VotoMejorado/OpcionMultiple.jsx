import traducirId from '../../../domain/utils/traducirId'
export default function OpcionMultiple({ id, descripcion, opciones, valor = [], onChange ,obligatorio,falloObligatoriedad,mostrarIndice}) {
  const toggleOpcion = (opcion) => {
    if (valor.includes(opcion)) {
      onChange(id, valor.filter(v => v !== opcion));
    } else {
      onChange(id, [...valor, opcion]);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{mostrarIndice?traducirId(id)+") ":""}{descripcion}{obligatorio?" *":""}</label>
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
      {falloObligatoriedad && (
        <div className="text-danger mt-1">
          Elija al menos una opcion
        </div>
      )}
    </div>
  );
}
