// src/components/Voto.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function Voto() {
  const { id } = useParams();
  const [encuesta, setEncuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [votado, setVotado] = useState(false);

  useEffect(() => {
    async function cargarEncuesta() {
      try {
        const res = await api.get(`/api/encuestas/${id}`);
        setEncuesta(res.data);
      } catch (error) {
        setMensaje('❌ No se pudo cargar la encuesta.');
      } finally {
        setCargando(false);
      }
    }

    cargarEncuesta();
  }, [id]);

  const votar = async (indiceOpcion) => {
    try {
      await api.post(`/api/encuestas/${id}/votar`, { opcion: indiceOpcion });
      setMensaje('✅ ¡Gracias por votar!');
      setVotado(true);
    } catch (error) {
      setMensaje('❌ Error al enviar tu voto.');
    }
  };

  if (cargando) return <p>Cargando encuesta...</p>;
  if (!encuesta) return <p>{mensaje}</p>;
  if (encuesta.expirada) return <p>⏰ La encuesta ha expirado.</p>;
  if (votado) return <p>{mensaje}</p>;

  return (
    <div>
      <h2>{encuesta.titulo}</h2>
      <p>{encuesta.pregunta}</p>

      {encuesta.opciones.map((op, i) => (
        <button
          key={i}
          onClick={() => votar(i)}
          style={{
            display: 'block',
            margin: '8px 0',
            padding: '10px',
            fontSize: '16px'
          }}
        >
          {op.texto}
        </button>
      ))}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Voto;
