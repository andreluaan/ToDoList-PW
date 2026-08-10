const { randomUUID } = require('crypto');
const { ITarefaRepository } = require('./ITarefaRepository');

class TarefaRepository extends ITarefaRepository {
  #tarefas = new Map();

  salvar(tarefa) {
    const id = tarefa.id || randomUUID();
    this.#tarefas.set(id, tarefa);
    return id;
  }

  buscarPorId(id) {
    return this.#tarefas.get(id) || null;
  }

  listar() {
    return Array.from(this.#tarefas.values());
  }

  remover(id) {
    return this.#tarefas.delete(id);
  }
}

module.exports = { TarefaRepository };