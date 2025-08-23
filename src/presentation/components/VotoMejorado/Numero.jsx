import traducirId from '../../../domain/utils/traducirId'
export default function Numero({ id, descripcion, valor, onChange,obligatorio,falloObligatoriedad,mostrarIndice }) {
  return (
    <div className="mb-3">
      <label className="form-label">{mostrarIndice?traducirId(id)+") ":""}{descripcion}{obligatorio?" *":""}</label>
      <input
        type="number"
        className="form-control"
        value={valor || ""}
        onChange={(e) => onChange(id, e.target.valueAsNumber)}
      />
      {falloObligatoriedad && (
        <div className="text-danger mt-1">
          Rellene la entrada numerica
        </div>
      )}
    </div>
  );
}
