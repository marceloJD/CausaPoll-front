export default function Numero({ id, descripcion, valor, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label">{descripcion}</label>
      <input
        type="number"
        className="form-control"
        value={valor || ""}
        onChange={(e) => onChange(id, e.target.valueAsNumber)}
      />
    </div>
  );
}
