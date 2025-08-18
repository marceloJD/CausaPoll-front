
import Texto from "./Texto"
import Numero from "./Numero"
import OpcionUnica from "./OpcionUnica"
import OpcionMultiple from "./OpcionMultiple"

export default function Seccion({
  titulo,
  respuestas=[],
  preguntas = [],
  mostrarAnterior = true,
  mostrarSiguiente = true,
  habilitarSiguiente = true,
  mostrarFinalizar = true,
  onCambio,
  onAnterior,
  onSiguiente,
  onFinalizar,
  encuestaFinalizada
}) {
  return (
    <div className="card w-100 mb-3">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{titulo}</h5>
        {/* Lista de items */}
        <ul className="list-group list-group-flush flex-grow-1 mb-3">
          {
          preguntas.map((pregunta) => {
                // Valor actual de la respuesta
                //const valor = respuestas[pregunta.id] || (pregunta.tipo === "opcionMultiple" ? [] : "");
                var  valor = ""
                var  valores = []
                // Buscar si ya existe la respuesta para esta pregunta
                const indice = respuestas.findIndex(r => r.idPregunta === pregunta.id);

                if (indice >= 0) {
                    valor=respuestas[indice].valor
                    valores=respuestas[indice].valores
                }

                // Renderizar según tipo
                let ComponentePregunta = null;
                switch (pregunta.tipo) {
                case "texto":
                    ComponentePregunta = (
                    <Texto
                        key={pregunta.id}
                        {...pregunta}
                        valor={valor}
                        onChange={onCambio}
                    />
                    );
                    break;
                case "numero":
                    ComponentePregunta = (
                    <Numero
                        key={pregunta.id}
                        {...pregunta}
                        valor={valor}
                        onChange={onCambio}
                    />
                    );
                    break;
                case "opcionUnica":
                    ComponentePregunta = (
                    <OpcionUnica
                        key={pregunta.id}
                        {...pregunta}
                        valor={valor}
                        onChange={onCambio}
                    />
                    );
                    break;
                case "opcionMultiple":
                    ComponentePregunta = (
                    <OpcionMultiple
                        key={pregunta.id}
                        {...pregunta}
                        valor={valor}
                        onChange={onCambio}
                    />
                    );
                    break;
                default:
                    return null;
                }

                return <li key={pregunta.id} className="list-group-item">{ComponentePregunta}</li>;
            })}
          {encuestaFinalizada&&
          <label className="form-label">Gracias por participar en nuestra encuesta</label>
          }
        </ul>

        {/* Botones de navegación */}
        <div className="d-flex justify-content-between">
          {mostrarAnterior && (
            <button className="btn btn-secondary" onClick={onAnterior}>
              Anterior
            </button>
          )}

          {mostrarSiguiente && (
            <button
              className="btn btn-primary"
              onClick={onSiguiente}
              disabled={!habilitarSiguiente}
            >
              Siguiente
            </button>
          )}

          {mostrarFinalizar && (
            <button className="btn btn-success" onClick={onFinalizar}>
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
