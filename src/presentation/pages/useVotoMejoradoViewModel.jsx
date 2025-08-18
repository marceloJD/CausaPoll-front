
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function useVotoMejoradoViewModel() {
   const { id } = useParams(); // 👈 aquí traemos el id de la URL
  const [seccionActual, setSeccionActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [encuesta, setEncuesta] = useState({});
  const [cargandoEncuesta , setCargandoEncuesta]=useState(0);
  const [pilaSeccionesVisitadas, setPilaSeccionesVisitadas]=useState([]);
  const [encuestaFinalizada , setEncuestaFinalizada ]=useState(false);
  
  //////////////////////////////////////////////////////////////
  const onEnviar = async () => {
    try {
      
    } catch (error) {
      
    }
  };
  
  const onAnteriorSeccion = ()=>{
    if(pilaSeccionesVisitadas.length==0){
      return
    }
    
    const antiguaPila = [...pilaSeccionesVisitadas]
    setSeccionActual(antiguaPila[antiguaPila.length-1])
    antiguaPila.pop()
    setPilaSeccionesVisitadas(antiguaPila)
    setEncuestaFinalizada(false)
    
  }
  const onSiguienteSeccion =  () => {
    if(encuestaFinalizada==true){
      return
    }


    var seccion = secciones[seccionActual].siguiente
  
    if(seccion==null||seccion==undefined){
      seccion= secciones[seccionActual].id*1+1      
    }else{
      seccion = parseInt(seccion, 10)
    }
    ////////validacion de obligatoriedad/////////

    ///////validacion de siguiente seccion///////
    var salto=evaluarReglas(respuestas,secciones[seccionActual].reglasDeSecuencia)
    if(salto!=""){
      seccion = parseInt(salto, 10)
    }
    ///////////////validacion de fin////////////
    if(seccion==secciones.length){
      setEncuestaFinalizada(true)
    }else if(seccion==-69){
      setEncuestaFinalizada(true)
    }
    ///////////////////////////////////////////

    const antiguaPila = [...pilaSeccionesVisitadas]
    antiguaPila.push(seccionActual)
    setSeccionActual(seccion)
    setPilaSeccionesVisitadas(antiguaPila)
   
    
  };

  const onCambioEnPregunta =  (idPregunta,valor, valores)=>{
    // Copiar estado antiguo
    const nuevo = [...respuestas];

    // Buscar si ya existe la respuesta para esta pregunta
    const indice = nuevo.findIndex(r => r.idPregunta === idPregunta);

    const respuestaActualizada = { idPregunta, valor, valores };

    if (indice >= 0) {
      // Actualizar existente
      nuevo[indice] = respuestaActualizada;
    } else {
      // Agregar nueva
      nuevo.push(respuestaActualizada);
    }

    setRespuestas(nuevo);
    console.log("Respuestas actualizadas:", nuevo);
  }
 

  ///////////////////////////////////////////////////////////
  useEffect(() => {
      const cargarSecciones = async () => {
        try {
          //const data = await obtenerSeccionesUseCase(); // trae JSON de repo/API
          setCargandoEncuesta(1);
          //const data1 = jsonPrueba();
          //await new Promise((resolve) => setTimeout(resolve, 1000));
          const response = await fetch(`http://localhost:4000/api/encuestaMejorada/${id}`);
          if (!response.ok) {
            throw new Error("Error en la petición");
          }

          const data = await response.json();
    
          setSecciones(data["nodos"]);         
          setEncuesta(data);                 
          setCargandoEncuesta(2)
        } catch (error) {
          setCargandoEncuesta(3)
        }
      };

      cargarSecciones();
  }, []);
  ///////////////////////////////////////////////////////////
  return {
    onEnviar,
    onSiguienteSeccion,
    onAnteriorSeccion,
    ////////////////////////
    seccionActual,      
    respuestas,    
    secciones,    
    encuesta,    
    cargandoEncuesta,    
    onCambioEnPregunta,
    pilaSeccionesVisitadas,
    encuestaFinalizada

  };
}

function jsonPrueba() {
  return {
    "id": "c0d1e2f3",
    "titulo": "Encuesta simple: Hijos",
    "descripcion": "Flujo condicional según si tienes hijos o no.",
    "tiempoSegundos": 1800,
    "activo": true,
    "nodos": [
      {
        "id": "0",
        "preguntas": [
          {
            "id": "0.0",
            "tipo": "opcionUnica",
            "descripcion": "¿Tienes hijos?",
            "opciones": ["Sí", "No"],
            "obligatoria": true
          }
        ],
        "reglasDeSecuencia": [
          {
            "condiciones": [
              { "id": "0.0", "operador": "==", "valor": "Sí" }
            ],
            "relacion": "AND",
            "nodoSiguiente": "1"
          },
          {
            "condiciones": [
              { "id": "0.0", "operador": "==", "valor": "No" }
            ],
            "relacion": "AND",
            "nodoSiguiente": "2"
          }
        ]
      },
      {
        "id": "1",
        "preguntas": [
          {
            "id": "1.0",
            "tipo": "texto",
            "descripcion": "¿Cuál es su nombre?",
            "obligatoria": true
          }
        ],
        "siguiente": "3"
      },
      {
        "id": "2",
        "preguntas": [
          {
            "id": "2.0",
            "tipo": "texto",
            "descripcion": "¿Por qué no tienes hijos?",
            "obligatoria": true
          }
        ],
        "siguiente": "3"
      },
      {
        "id": "3",
        "preguntas": [
          {
            "id": "3.0",
            "tipo": "texto",
            "descripcion": "Comentario (opcional)",
            "obligatoria": false
          }
        ]
      }
    ]
  }
}



function evaluarReglas(respuestas, reglasDeSecuencia) {
  if(reglasDeSecuencia==null){
    return ""
  }
  for (const regla of reglasDeSecuencia) {
    const resultados = regla.condiciones.map(c => evaluarCondicion(respuestas, c));

    let cumple = false;
    if (resultados.length === 1) {
      cumple = resultados[0]; // solo una condición
    } else if (regla.relacion === "AND") {
      cumple = resultados.every(r => r === true);
    } else if (regla.relacion === "OR") {
      cumple = resultados.some(r => r === true);
    }

    if (cumple) {
      return regla.nodoSiguiente;
    }
  }
  return "";
}

function evaluarCondicion(respuestas, condicion) {
  const respuesta = respuestas.find(r => r.idPregunta === condicion.id);
  if (!respuesta) return false; // No respondió esa pregunta

  const valorUsuario = respuesta.valor;
  const valorCondicion = condicion.valor;

  switch (condicion.operador) {
    case "==":
      return valorUsuario == valorCondicion;
    case "!=":
      return valorUsuario != valorCondicion;
    case ">":
      return Number(valorUsuario) > Number(valorCondicion);
    case ">=":
      return Number(valorUsuario) >= Number(valorCondicion);
    case "<":
      return Number(valorUsuario) < Number(valorCondicion);
    case "<=":
      return Number(valorUsuario) <= Number(valorCondicion);
    case "in": // si la respuesta está en un array
      return Array.isArray(valorCondicion) && valorCondicion.includes(valorUsuario);
    case "contains": // para opcionMultiple
      return Array.isArray(valorUsuario) && valorUsuario.includes(valorCondicion);
    default:
      return false;
  }
}



