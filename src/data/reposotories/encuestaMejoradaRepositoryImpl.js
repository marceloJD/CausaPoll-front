import api from '../remote/api'

export default class EncuestaMejoradaRepositoryImpl {
  async getEncuestaMejorada(id) {

    const response = await api.get("/encuestaMejorada/"+id);

    return response.data;
  }

  async postEncuestaUseCase(respuestas) {
    console.log("postEncuestaUseCase", respuestas);

    const response = await api.post("/encuestaMejorada", respuestas);

    return response.data;
  }
}