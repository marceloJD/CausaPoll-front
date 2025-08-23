export default class obtenerEncuestaMejorada {
  constructor(repo) {
    this.repo = repo; // ✅ inyectado
  }

  async execute(id) {
    
    return await this.repo.getEncuestaMejorada(id);
  }
}