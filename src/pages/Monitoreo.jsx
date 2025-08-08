// src/components/Monitoreo.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function Monitoreo() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clave = queryParams.get('clave');

  const [resultados, setResultados] = useState([]);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    if (!id || !clave) return;

    const socket = io('https://causapoll-api-production.up.railway.app'); // Ajusta según backend

    socket.on('connect', () => {
      setConectado(true);
      socket.emit('unirse-a-encuesta', { id, clave });
    });

    socket.on('voto', (opciones) => {
      setResultados(opciones);
    });

    // Estado inicial
    fetch(`https://causapoll-api-production.up.railway.app/api/encuestas/${id}/avance?key=${clave}`)
      .then((res) => res.json())
      .then((data) => setResultados(data.opciones))
      .catch((err) => console.error('Error al obtener encuesta:', err));

    return () => {
      socket.disconnect();
    };
  }, [id, clave]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Monitoreando encuesta ID: {id}</h2>
      <p>Clave: NOP</p>
      <p>Link: Clave: {`${window.location.origin}/votar/${id}`}</p>
      <p>Socket: {conectado ? '🟢 Conectado' : '🔴 Desconectado'}</p>

      {resultados.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={resultados}
              dataKey="votos"
              nameKey="texto"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {resultados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>Cargando resultados...</p>
      )}
    </div>
  );
}

export default Monitoreo;
