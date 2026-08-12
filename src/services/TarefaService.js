const { randomUUID } = require('crypto');
const { Tarefa } = require('../models/Tarefa');

class TarefaService {
  /** @param {import('../repositories/ITarefaRepository').ITarefaRepository} repository */
  constructor(repository) {
    this.repository = repository;
  }

  criarTarefa({ titulo, descricao, categoria }) {
    const tarefa = new Tarefa({ id: randomUUID(), titulo, descricao, categoria });
    this.repository.salvar(tarefa);
    return tarefa;
  }

  listarTarefas() {
    return this.repository.listar();
  }

  buscarTarefa(id) {
    const tarefa = this.repository.buscarPorId(id);
    if (!tarefa) throw new Error('Tarefa não encontrada.');
    return tarefa;
  }

  concluirTarefa(id) {
    const tarefa = this.buscarTarefa(id);
    tarefa.concluir();
    return tarefa;
  }

  reabrirTarefa(id) {
    const tarefa = this.buscarTarefa(id);
    tarefa.reabrir();
    return tarefa;
  }

  atualizarTarefa(id, { titulo, descricao, categoria }) {
    const tarefa = this.buscarTarefa(id);
    tarefa.atualizar({ titulo, descricao, categoria });
    return tarefa;
  }

  removerTarefa(id) {
    const removida = this.repository.remover(id);
    if (!removida) throw new Error('Tarefa não encontrada.');
  }
}

module.exports = { TarefaService };