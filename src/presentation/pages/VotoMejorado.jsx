
import useVotoMejoradoViewModel from "./useVotoMejoradoViewModel" ;
import Cabecera from "../components/VotoMejorado/Cabecera";
import Seccion from "../components/VotoMejorado/Seccion";

export default function VotoMejorado() {
  const viewModel =useVotoMejoradoViewModel();
    console.log()
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-12 col-md-6">
        <Cabecera 
        titulo="Titulo 1"
        descripcion = "Descripcion generica , nada importante por aca..."
        />

        <Seccion
          titulo={
                viewModel.encuestaFinalizada
                ?"Encuesta finalizada:"                
                :"Preguntas: "+(viewModel.seccionActual*1+1)+"/"+viewModel.secciones.length
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
          onFinalizar={()=>{}}
          onCambio={(idPregunta,valor,valores)=>{
            viewModel.onCambioEnPregunta(idPregunta,valor,valores)
          }}
          encuestaFinalizada={viewModel.encuestaFinalizada==true}
        />
      </div>
      {/* Overlay de carga */}
      {viewModel.cargandoEncuesta == 1 && (
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
