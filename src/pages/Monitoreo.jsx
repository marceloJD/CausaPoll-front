import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function Monitoreo() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clave = queryParams.get('clave');

  const [resultados, setResultados] = useState([]);
  const [jsonGeneral, setJsonGeneral] = useState([]);
  const [conectado, setConectado] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Nuevo estado para el timer
  const [tiempoRestante, setTiempoRestante] = useState(30);

  const link = `${window.location.origin}/votar/${id}`;

  // Lógica del contador
  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!id || !clave) return;

    const socket = io('https://causapoll-api-production.up.railway.app');

    socket.on('connect', () => {
      setConectado(true);
      socket.emit('unirse-a-encuesta', { id, clave });
    });

    socket.on('voto', (opciones) => {
      setResultados(opciones);
    });

    fetch(`https://causapoll-api-production.up.railway.app/api/encuestas/${id}/avance?key=${clave}`)
      .then((res) => res.json())
      .then((data) => {
        setTiempoRestante(data.tiempoRestante)
        setResultados(data.opciones);
        setJsonGeneral(data);
      })
      .catch((err) => console.error('Error al obtener encuesta:', err));

    return () => {
      socket.disconnect();
    };
  }, [id, clave]);

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="mb-0">{jsonGeneral.titulo}</h1>
        <div className="d-flex align-items-center">
          <span
            className={`ms-3 d-flex align-items-center fw-bold ${conectado ? 'text-success' : 'text-danger'}`}
            title={conectado ? 'Conectado' : 'Desconectado'}
          >
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '1rem' }}></i>
            {conectado ? 'Online' : 'Offline'}
          </span>

          <div
            className="ms-2 px-2 py-1 rounded"
            style={{
              backgroundColor: tiempoRestante <= 5 ? 'red' : 'green',
              color: tiempoRestante <= 10 ? 'black' : 'white',
              fontWeight: 'bold',
              minWidth: '40px',
              textAlign: 'center'
            }}
          >
            {Math.floor(tiempoRestante / 60)}:
                {String(tiempoRestante % 60).padStart(2, '0')}
          </div>
        </div>
      </div>

      <h2>{jsonGeneral.pregunta}</h2>

      {resultados.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resultados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="texto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votos" fill="#8884d8">
              {resultados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Cargando resultados...</p>
      )}

      <div className="input-group mb-3">
        <input type="text" className="form-control" value={link} readOnly />
        <button className="btn btn-secondary" onClick={copiarAlPortapapeles} title="Copiar enlace">
          <i className="bi bi-clipboard"></i>
          <span className="d-none d-sm-inline ms-1">Copiar enlace</span>
        </button>
        <button className="btn btn-primary" onClick={() => setShowQR(true)} title="Mostrar código QR">
          <i className="bi bi-qr-code"></i>
          <span className="d-none d-sm-inline ms-1">Mostrar QR</span>
        </button>
      </div>

      {copiado && (
        <div className="alert alert-success d-flex align-items-center p-2 py-2 small mt-2 mb-3" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>Copiado al portapapeles</div>
        </div>
      )}

      {showQR && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowQR(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content text-center p-4">
              <div className="modal-header border-0">
                <h5 className="modal-title">Escanea para votar</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowQR(false)}></button>
              </div>
              <div className="modal-body">
                <QRCodeCanvas value={link} size={200} />
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button type="button" className="btn btn-secondary" onClick={() => setShowQR(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Monitoreo;
