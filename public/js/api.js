
class TarefaApi {
  constructor(baseUrl = '/tarefas') {
    this.baseUrl = baseUrl;
  }

  async _request(caminho, options = {}) {
    const resposta = await fetch(`${this.baseUrl}${caminho}`, options);

    if (resposta.status === 204) return null;

    const dados = await resposta.json().catch(() => null);

    if (!resposta.ok) {
      throw new Error(dados?.erro || 'Não foi possível completar a operação.');
    }

    return dados;
  }

  listar() {
    return this._request('', { method: 'GET' });
  }

  criar({ titulo, descricao, categoria }) {
    return this._request('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, categoria }),
    });
  }

  atualizar(id, { titulo, descricao, categoria }) {
    return this._request(`/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, categoria }),
    });
  }

  concluir(id) {
    return this._request(`/${id}/concluir`, { method: 'PATCH' });
  }

  reabrir(id) {
    return this._request(`/${id}/reabrir`, { method: 'PATCH' });
  }

  remover(id) {
    return this._request(`/${id}`, { method: 'DELETE' });
  }
}