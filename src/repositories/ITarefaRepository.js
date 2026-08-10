
class ITarefaRepository {
  salvar(_tarefa) {
    throw new Error('Método salvar() não implementado.');
  }

  buscarPorId(_id) {
    throw new Error('Método buscarPorId() não implementado.');
  }

  listar() {
    throw new Error('Método listar() não implementado.');
  }

  remover(_id) {
    throw new Error('Método remover() não implementado.');
  }
}

module.exports = { ITarefaRepository };