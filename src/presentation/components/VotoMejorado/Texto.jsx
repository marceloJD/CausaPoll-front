export default function Texto({ id, descripcion, valor, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label">{descripcion}</label>
      <input
        type="text"
        className="form-control"
        value={valor || ""}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
}