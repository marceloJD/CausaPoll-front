
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function useVotoMejoradoViewModel(getEncuestasUseCase,postEncuestaUseCase) {
  const { id } = useParams(); // 👈 aquí traemos el id de la URL
  const [seccionActual, setSeccionActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [encuesta, setEncuesta] = useState({});
  const [cargandoEncuesta , setCargandoEncuesta]=useState(0);
  const [pilaSeccionesVisitadas, setPilaSeccionesVisitadas]=useState([]);
  const [encuestaFinalizada , setEncuestaFinalizada ]=useState(false);
  const [mensajeSimpleVisible, setMensajeSimpleVisible]=useState(false);
  const [mensajeSimpleTitulo, setMensajeSimpleTitulo]=useState("");
  const [mensajeSimpleTexto, setMensajeSimpleTexto]=useState("");
  const [preguntasQueFallaroObligatoriedad,setPreguntasQueFallaroObligatoriedad]=useState([]);
  const [estadoEnvio,setEstadoEnvio]=useState(0)
  //////////////////////////////////////////////////////////////
  const onEnviar = async () => {
    var preguntasRepondidas = getPreguntasRespondidas(encuesta,pilaSeccionesVisitadas,respuestas)    
    try {
      setEstadoEnvio(1)
      var res = await postEncuestaUseCase.execute({encuesta:encuesta.id,titulo:encuesta.titulo,respuestas:preguntasRepondidas})
      setEstadoEnvio(2)
      setMensajeSimpleTexto("Encuesta enviada correctamente")
      setMensajeSimpleTitulo("Fin de la encuesta")
      setMensajeSimpleVisible(true)
    } catch (error) {
      setMensajeSimpleTexto("Hubo un error al enviar su encuesta")
      setMensajeSimpleTitulo("Error")
      setEstadoEnvio(3)
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
    var cumple = true
    var fallidas =[]
    setPreguntasQueFallaroObligatoriedad(fallidas)
    secciones[seccionActual].preguntas.forEach((pregunta)=>{
      if(pregunta.obligatoria){
        const respuesta = respuestas.find(r => r.idPregunta === pregunta.id);
        var evaluacion = cumpleObligatoriedad(pregunta,respuesta)
        if(evaluacion!=true){
          cumple=false  
          fallidas.push(pregunta.id)        
        }
      }
      
    })
    if(!cumple){
      setPreguntasQueFallaroObligatoriedad(fallidas)
      setMensajeSimpleTexto("Rellenar las preguntas obligatorias(*) ")
      setMensajeSimpleTitulo("Preguntas obligatorias")
      setMensajeSimpleVisible(true)
      return
    }

    //////////VALIDACION DE reglasDeSalida///////////
    cumple = true
  
    if(secciones[seccionActual].reglasDeSalida){     
      cumple = false 
      var mensaje=evaluarReglasDeSalida(respuestas,secciones[seccionActual].reglasDeSalida)      
      if(mensaje == ""){///NO HUBO ERROR, secumplio todo        
        cumple = true        
      }      
      if(secciones[seccionActual].reglasDeSalida.length==0){////NO HABIAN REGLAS
        cumple = true
      }
    }
    if(!cumple){         
      setMensajeSimpleTexto(mensaje)
      setMensajeSimpleTitulo("Valide sus respuestas")
      setMensajeSimpleVisible(true)
      return
    }
   


    ///////validacion de siguiente seccion///////
    var salto=evaluarReglasDeSalto(respuestas,secciones[seccionActual].reglasDeSecuencia)
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
 const actualizarPreguntasQueFallaroObligatoriedad = (id) => {
  console.log("preguntasQueFallaroObligatoriedad",id,preguntasQueFallaroObligatoriedad)
  const fallidas = preguntasQueFallaroObligatoriedad.filter(it => it !== id)
  console.log("fallidas",id,fallidas)
  setPreguntasQueFallaroObligatoriedad(fallidas)
  }
  
 

  ///////////////////////////////////////////////////////////
  useEffect(() => {
      const cargarSecciones = async () => {
        try {
          
          setCargandoEncuesta(1);
          
          const data = await getEncuestasUseCase.execute(id)
          //console.log(123123,response)
          /*
          if (!response.ok) {
            console.log(123123,response)
            throw new Error("Error en la petición");
          }
          */          
          setSecciones(data["nodos"]);         
          setEncuesta(data);                 
          setCargandoEncuesta(2)
        } catch (error) {
          console.log(error)
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
    encuestaFinalizada,
    mensajeSimpleVisible,
    mensajeSimpleTexto,
    mensajeSimpleTitulo,
    setMensajeSimpleVisible,
    preguntasQueFallaroObligatoriedad,
    setPreguntasQueFallaroObligatoriedad,
    actualizarPreguntasQueFallaroObligatoriedad,
    estadoEnvio
  };
}





function evaluarReglasDeSalto(respuestas, reglasDeSecuencia) {
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
    }else{////CASO LENGUAJE  [0]*-([1]+[2])
      var res = evaluarExpresionBooleana(regla.relacion,resultados)
      if(res){
        return regla.nodoSiguiente;
      }
    }

    if (cumple) {
      return regla.nodoSiguiente;
    }
  }
  return "";
}
function evaluarReglasDeSalida(respuestas, reglasDeSalida) {
  if(reglasDeSalida==null){
    return ""
  }
  if(reglasDeSalida.length==0){
    return ""
  }
  for (const regla of reglasDeSalida) {
    const resultados = regla.condiciones.map(c => evaluarCondicion(respuestas, c));

    let cumple = true;
    if (resultados.length === 1) {
      cumple = resultados[0]; // solo una condición
    } else if (regla.relacion === "AND") {
      cumple = resultados.every(r => r === true);
    } else if (regla.relacion === "OR") {
      cumple = resultados.some(r => r === true);
    }else{////CASO LENGUAJE  [0]*-([1]+[2])
      cumple = evaluarExpresionBooleana(regla.relacion,resultados)
      if(!cumple){///NO SE CUMPLE
        return regla.mensaje;
      }
    }
    if (!cumple) {
      return regla.mensaje;
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


function evaluarExpresionBooleana(expresion, valores) {
  // Paso 1: reemplazar {i} por true/false
  let exp = expresion;
  valores.forEach((valor, i) => {
    exp = exp.replace(new RegExp(`\\{${i}\\}`, 'g'), valor.toString());
  });

  // Paso 2: normalizar operadores
  exp = exp.replace(/AND/g, '&&')
           .replace(/OR/g, '||')
           .replace(/-/g, '!'); // "-" lo tratamos como NOT

  // Paso 3: evaluar usando eval
  return eval(exp);
}


function cumpleObligatoriedad(pregunta,valor){
  console.log("-"+valor+"-")
  if(valor==undefined ||valor==null){
    return false
  }
  if(pregunta.tipo== "texto"){
    return valor.valor!="" && valor.valor!=null;
  }else if(pregunta.tipo== "numero"){
    return valor.valor!=""&& valor.valor!=null;
  }else if(pregunta.tipo== "opcionUnica"){
    return valor.valor!=""&& valor.valor!=null;    
  }else if(pregunta.tipo== "opcionMultiple"){
    if(valor.valor==null){
      return false
    }
    return valor.valor.length>0
  }else{
    return false
  }
}


function getPreguntasRespondidas(encuesta, pila, respuestas) {
  const mapaRespuestas = Object.fromEntries(respuestas);

  var visitados= encuesta.nodos
    .filter(n => pila.includes(n.id*1)) // solo nodos visitados

  console.log("visitados",visitados)

  return visitados.flatMap(n =>
      n.preguntas.map(p => ({
        id: p.id,
        descripcion: p.descripcion,
        valor: mapaRespuestas[p.id] ?? null // si no hay respuesta → null
      }))
  );
}