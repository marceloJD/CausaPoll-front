export default class postEncuestaUseCase {
  constructor(repo) {
    this.repo = repo; // ✅ inyectado
  }

  async execute(respuestas) {
    
    return await this.repo.postEncuestaUseCase(respuestas);
  }
}