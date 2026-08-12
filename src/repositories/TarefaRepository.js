const { ITarefaRepository } = require('./ITarefaRepository');
const { Tarefa } = require('../models/Tarefa');
const db = require('../database/db');
const { CategoriaRepository } = require('./CategoriaRepository');

class TarefaRepository extends ITarefaRepository {
  constructor() {
    super();
    this.db = db;
    this.categoriaRepository = new CategoriaRepository(db);
  }

  salvar(tarefa) {
    const dto = tarefa.toJSON();
    const categoriaId = dto.categoria ? this.categoriaRepository.buscarOuCriar(dto.categoria) : null;

    this.db.prepare(`
      INSERT INTO tarefas (id, titulo, descricao, status, categoria_id)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        titulo = excluded.titulo,
        descricao = excluded.descricao,
        status = excluded.status,
        categoria_id = excluded.categoria_id
    `).run(dto.id, dto.titulo, dto.descricao, dto.status, categoriaId);

    return dto.id;
  }

  buscarPorId(id) {
    const row = this.db.prepare(`
      SELECT t.id, t.titulo, t.descricao, t.status, c.nome AS categoria
      FROM tarefas t
      LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE t.id = ?
    `).get(id);

    return row ? this._paraEntidade(row) : null;
  }

  listar() {
    const rows = this.db.prepare(`
      SELECT t.id, t.titulo, t.descricao, t.status, c.nome AS categoria
      FROM tarefas t
      LEFT JOIN categorias c ON c.id = t.categoria_id
      ORDER BY t.criado_em
    `).all();

    return rows.map((row) => this._paraEntidade(row));
  }

  remover(id) {
    const info = this.db.prepare('DELETE FROM tarefas WHERE id = ?').run(id);
    return info.changes > 0;
  }

  _paraEntidade(row) {
    const tarefa = new Tarefa({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      categoria: row.categoria,
    });
    if (row.status === 'concluida') tarefa.concluir();
    return tarefa;
  }
}

module.exports = { TarefaRepository };