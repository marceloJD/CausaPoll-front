
import useVotoMejoradoViewModel from "./useVotoMejoradoViewModel" ;
import Cabecera from "../components/VotoMejorado/Cabecera";
import Seccion from "../components/VotoMejorado/Seccion";
import MensajeSimple from "../components/VotoMejorado/MensajeSimple"

export default function VotoMejorado({casosDeUso}) {
  const viewModel =useVotoMejoradoViewModel(casosDeUso.obtenerEncuestaMejorada,casosDeUso.postEncuestaUseCase);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-12 col-md-6">
        <Cabecera 
        titulo={viewModel.encuesta.titulo}
        descripcion = {viewModel.encuesta.descripcion}
        />

        <Seccion
          mostrarIndices={viewModel.encuesta.mostrarIndices||false}
          titulo={
                viewModel.encuestaFinalizada
                ?"Encuesta finalizada:"                
                :"Secciones: "+(viewModel.seccionActual*1+1)+"/"+viewModel.secciones.length
            }
          preguntas={viewModel.secciones[viewModel.seccionActual]?.preguntas || []}
          respuestas={viewModel.respuestas}
          mostrarAnterior={viewModel.pilaSeccionesVisitadas.length>0}
          mostrarSiguiente={viewModel.encuestaFinalizada==false}
          habilitarSiguiente={viewModel.encuestaFinalizada==false}
          mostrarFinalizar={viewModel.encuestaFinalizada==true}
          onAnterior={()=>{
            viewModel.onAnteriorSeccion()
          }}
          onSiguiente={()=>{
            viewModel.onSiguienteSeccion()            
          }}
          onFinalizar={()=>{
            viewModel.onEnviar()
          }}
          onCambio={(idPregunta,valor,valores)=>{
            viewModel.onCambioEnPregunta(idPregunta,valor,valores)
            viewModel.actualizarPreguntasQueFallaroObligatoriedad(idPregunta)
          }}
          encuestaFinalizada={viewModel.encuestaFinalizada==true}
          preguntasQueFallaronObligatoriedad={viewModel.preguntasQueFallaroObligatoriedad}
        />
      </div>
      {viewModel.mensajeSimpleVisible &&(
        <MensajeSimple
          titulo={viewModel.mensajeSimpleTitulo}
          texto={viewModel.mensajeSimpleTexto}
          onClose={()=>{viewModel.setMensajeSimpleVisible(false)}}
        />
      )}
      {(viewModel.cargandoEncuesta == 1|| viewModel.estadoEnvio==1) && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
