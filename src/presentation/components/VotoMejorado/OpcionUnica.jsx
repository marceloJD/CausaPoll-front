import traducirId from '../../../domain/utils/traducirId'
export default function OpcionUnica({ id, descripcion, opciones, valor, onChange ,obligatorio,falloObligatoriedad,mostrarIndice}) {
  return (
    <div className="mb-3">
      <label className="form-label">{mostrarIndice?traducirId(id)+") ":""}{descripcion}{obligatorio?" *":""}</label>
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
      {falloObligatoriedad && (
        <div className="text-danger mt-1">
          Elija una opcion
        </div>
      )}
    </div>
  );
}
