// compositionRoot.js
import EncuestaMejoradaRepositoryImpl from "./data/reposotories/encuestaMejoradaRepositoryImpl.js";
import obtenerEncuestaMejorada from "./domain/usecases/obtenerEncuestaMejorada.jsx";
import postEncuestaUseCase from "./domain/usecases/postEncuestaUseCase.jsx";


export function makeUseCases() {
  const repo = new EncuestaMejoradaRepositoryImpl();
  return {
    obtenerEncuestaMejorada: new obtenerEncuestaMejorada(repo),
    postEncuestaUseCase: new postEncuestaUseCase(repo)
  };
}