const STATUS = {
  PENDENTE: 'pendente',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDA: 'concluida',
};

class Tarefa {
  #id;
  #titulo;
  #descricao;
  #status;
  #categoria;

  constructor({ id, titulo, descricao = '', categoria = null }) {
    if (!titulo) {
      throw new Error('Tarefa precisa de um título.');
    }
    this.#id = id;
    this.#titulo = titulo;
    this.#descricao = descricao;
    this.#categoria = categoria;
    this.#status = STATUS.PENDENTE;
  }

  concluir() {
    this.#status = STATUS.CONCLUIDA;
  }

  reabrir() {
    this.#status = STATUS.PENDENTE;
  }

  atualizar({ titulo, descricao, categoria }) {
    if (titulo !== undefined) {
      if (!titulo) throw new Error('Título não pode ficar vazio.');
      this.#titulo = titulo;
    }
    if (descricao !== undefined) this.#descricao = descricao;
    if (categoria !== undefined) this.#categoria = categoria;
  }

  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      descricao: this.#descricao,
      status: this.#status,
      categoria: this.#categoria,
    };
  }

  get id() {
    return this.#id;
  }
}

module.exports = { Tarefa, STATUS };