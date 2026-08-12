class CategoriaRepository {
  constructor(db) {
    this.db = db;
  }

  buscarOuCriar(nome) {
    const existente = this.db.prepare('SELECT id FROM categorias WHERE nome = ?').get(nome);
    if (existente) return existente.id;

    const info = this.db.prepare('INSERT INTO categorias (nome) VALUES (?)').run(nome);
    return Number(info.lastInsertRowid);
  }
}

module.exports = { CategoriaRepository };