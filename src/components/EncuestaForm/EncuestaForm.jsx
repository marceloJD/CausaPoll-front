import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const EncuestaForm = ({ onCrearEncuesta }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState(5);
  const [opciones, setOpciones] = useState(['', '']);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const handleChangeOpcion = (index, valor) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = valor;
    setOpciones(nuevasOpciones);
  };

  const agregarOpcion =async () => setOpciones([...opciones, '']);
  const quitarOpcion = (index) => {
    if (opciones.length <= 2) return;
    setOpciones(opciones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const opcionesValidas = opciones.filter((op) => op.trim() !== '');
    if (!titulo.trim() || !descripcion.trim() || opcionesValidas.length < 2) {
      alert('Debe tener título y al menos 2 opciones válidas.');
      return;
    }

    const encuesta = {
    "titulo": titulo,
    "pregunta": descripcion,
    "opciones": opcionesValidas,
    "duracionSegundos": duracion*60
    }    

    setCargando(true);
    var response = await onCrearEncuesta(encuesta); // Este callback se lo pasas tú desde App o desde la vista principal
    setCargando(false);
    console.log(response)

 
    if (response?.id && response?.key) {
        navigate(`/monitoreo/${response.id}?clave=${response.key}`);
    } else {
        alert("Error: La encuesta no se creó correctamente.");
    }
  };

  return ( 
    <div className="container my-5">
      <div className="mx-auto col-12 col-sm-10 col-md-8 col-lg-6">
        <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
          <h2 className="mb-3">Crear Nueva Encuesta</h2>

          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Encuesta de causas"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="¿Cual es tu causa favorita?"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={duracion}
              onChange={(e) => setDuracion(parseInt(e.target.value) || 1)}
            />
          </Form.Group>

          <Form.Label>Opciones</Form.Label>
          {opciones.map((opcion, index) => (
            <InputGroup className="mb-2" key={index}>
                <Form.Control
                type="text"
                placeholder={`Opción ${index + 1}`}
                value={opcion}
                onChange={(e) => handleChangeOpcion(index, e.target.value)}
                required
                />
                {opciones.length > 2 && (
                <Button variant="danger" onClick={() => quitarOpcion(index)} title="Eliminar opción">
                  <i className="bi bi-x"></i>
                </Button>
                )}
            </InputGroup>
            ))}
          <div className="d-grid">
            <Button variant="secondary" onClick={agregarOpcion} className="mb-3">
              <i className="bi bi-plus-circle me-1"></i>
              <span >Agregar opción</span>
            </Button>
          </div>
          

          <div className="d-grid">
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear Encuesta'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
    
  );
};

export default EncuestaForm;
