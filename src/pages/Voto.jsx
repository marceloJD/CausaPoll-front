import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function Voto() {
  const { id } = useParams();
  const [encuesta, setEncuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [votado, setVotado] = useState(false);
  const [seleccion, setSeleccion] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    async function cargarEncuesta() {
      try {
        const res = await api.get(`/api/encuestas/${id}`);
        setEncuesta(res.data);
        if (res.data.tiempoRestante != null) {
          setTiempoRestante(res.data.tiempoRestante);
        }
      } catch (error) {
        setMensaje('❌ No se pudo cargar la encuesta.');
      } finally {
        setCargando(false);
      }
    }

    cargarEncuesta();
  }, [id]);

  // Contador regresivo
  useEffect(() => {
    if (tiempoRestante == null) return;
    if (tiempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTiempoRestante(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const votar = async () => {
    if (seleccion === null) return;

    try {
      await api.post(`/api/encuestas/${id}/votar`, { opcion: seleccion });
      setMensaje('✅ ¡Gracias por votar!');
      setVotado(true);
    } catch (error) {
      setMensaje('❌ Error al enviar tu voto.');
    }
  };

  if (cargando) return <p className="text-center mt-5">Cargando encuesta...</p>;
  if (!encuesta) return <p className="text-center mt-5">{mensaje}</p>;
  if (encuesta.expirada) return <p className="text-center mt-5">⏰ La encuesta ha expirado.</p>;
  if (votado) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-sm p-4 text-center" style={{ width: '100%', maxWidth: '500px' }}>
          <h2 className="card-title mb-4">Encuesta enviada</h2>
          <div className={`alert ${mensaje.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {mensaje}
          </div>
          <p className="text-muted mt-3">Puedes cerrar esta ventana.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-sm p-4 position-relative"
        style={{ width: '100%', maxWidth: '500px' }}
      >
        

        <h4 className="card-title mb-3">{encuesta.titulo || 'Online test'}</h4>
        <p className="card-text mb-4">{encuesta.pregunta || 'Untitled Question'}</p>

        <form>
          {encuesta.opciones.map((op, i) => (
            <div className="form-check mb-2" key={i}>
              <input
                className="form-check-input"
                type="radio"
                name="opcion"
                id={`opcion${i}`}
                checked={seleccion === i}
                onChange={() => setSeleccion(i)}
              />
              <label className="form-check-label" htmlFor={`opcion${i}`}>
                {op.texto}
              </label>
            </div>
          ))}

          <div className="d-grid mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={votar}
              disabled={seleccion === null || tiempoRestante === 0}
            >
              Enviar (
              <span
                className={tiempoRestante <= 10 ? 'text-danger fw-bold' : 'text-white'}
              >
                {Math.floor(tiempoRestante / 60)}:
                {String(tiempoRestante % 60).padStart(2, '0')}
              </span>
              )
            </button>
          </div>

          {mensaje && <p className="mt-3 text-center">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default Voto;
