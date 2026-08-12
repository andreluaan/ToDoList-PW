const api = new TarefaApi();

const categoryNav = document.getElementById('categoryNav');
const viewTitle = document.getElementById('viewTitle');
const viewSubtitle = document.getElementById('viewSubtitle');
const listaTarefas = document.getElementById('listaTarefas');
const addTaskForm = document.getElementById('addTaskForm');
const tituloInput = document.getElementById('tituloInput');
const descricaoInput = document.getElementById('descricaoInput');
const categoriaInput = document.getElementById('categoriaInput');
const categoriasDatalist = document.getElementById('categoriasExistentes');
const feedback = document.getElementById('feedback');

const editModalEl = document.getElementById('editModal');
const editModal = new bootstrap.Modal(editModalEl);
const editForm = document.getElementById('editForm');

const deleteModalEl = document.getElementById('deleteModal');
const deleteModal = new bootstrap.Modal(deleteModalEl);
const deleteTarefaTitulo = document.getElementById('deleteTarefaTitulo');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
let tarefaParaExcluir = null;

let tarefas = [];
let categoriaAtiva = ''; // '' = "Todas"

const SEM_CATEGORIA = 'Sem categoria';

init();

async function init() {
  addTaskForm.addEventListener('submit', aoCriarTarefa);
  editForm.addEventListener('submit', aoSalvarEdicao);
  confirmDeleteBtn.addEventListener('click', aoConfirmarExclusao);
  await carregarTarefas();
}

async function carregarTarefas() {
  try {
    tarefas = await api.listar();
    renderCategorias();
    renderLista();
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

function renderCategorias() {
  const categorias = [...new Set(tarefas.map((t) => t.categoria || SEM_CATEGORIA))].sort();

  categoryNav.innerHTML = '';
  categoryNav.appendChild(criarBotaoCategoria('', 'Todas'));
  categorias.forEach((cat) => categoryNav.appendChild(criarBotaoCategoria(cat, cat)));

  // se a categoria ativa não existe mais (ex: última tarefa dela foi removida), volta pra "Todas"
  if (categoriaAtiva && !categorias.includes(categoriaAtiva)) {
    categoriaAtiva = '';
  }

  atualizarDatalistCategorias();
}

function atualizarDatalistCategorias() {
  const categoriasReais = [...new Set(tarefas.map((t) => t.categoria).filter(Boolean))].sort();
  categoriasDatalist.innerHTML = categoriasReais
    .map((cat) => `<option value="${escaparHtml(cat)}"></option>`)
    .join('');
}

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function criarBotaoCategoria(valor, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'category-item' + (valor === categoriaAtiva ? ' active' : '');
  btn.dataset.categoria = valor;
  btn.textContent = label;
  btn.addEventListener('click', () => {
    categoriaAtiva = valor;
    renderCategorias();
    renderLista();
  });
  return btn;
}

function renderLista() {
  listaTarefas.innerHTML = '';

  if (tarefas.length === 0) {
    viewTitle.textContent = 'Todas';
    viewSubtitle.textContent = 'Suas tarefas, organizadas por categoria.';
    listaTarefas.innerHTML = '<p class="estado-vazio">Nada por aqui ainda. Adicione sua primeira tarefa acima.</p>';
    return;
  }

  if (categoriaAtiva === '') {
    renderVisaoTodas();
  } else {
    renderVisaoCategoria(categoriaAtiva);
  }
}

function renderVisaoTodas() {
  viewTitle.textContent = 'Todas';
  viewSubtitle.textContent = 'Suas tarefas pendentes, organizadas por categoria.';

  const pendentes = tarefas.filter((t) => t.status !== 'concluida');
  const concluidas = tarefas.filter((t) => t.status === 'concluida');

  if (pendentes.length === 0) {
    listaTarefas.innerHTML = '<p class="estado-vazio">Nenhuma tarefa pendente. Bom trabalho!</p>';
  } else {
    const porCategoria = agruparPorCategoria(pendentes);
    Object.keys(porCategoria).sort().forEach((categoria) => {
      listaTarefas.appendChild(criarTituloSecao(categoria));
      porCategoria[categoria].forEach((t) => listaTarefas.appendChild(criarLinhaTarefa(t)));
    });
  }

  if (concluidas.length > 0) {
    listaTarefas.appendChild(criarTituloSecao('Concluídas'));
    concluidas.forEach((t) => listaTarefas.appendChild(criarLinhaTarefa(t)));
  }
}

function renderVisaoCategoria(categoria) {
  viewTitle.textContent = categoria;
  viewSubtitle.textContent = 'Tarefas desta categoria.';

  const daCategoria = tarefas.filter((t) => (t.categoria || SEM_CATEGORIA) === categoria);
  const pendentes = daCategoria.filter((t) => t.status !== 'concluida');
  const concluidas = daCategoria.filter((t) => t.status === 'concluida');

  if (pendentes.length === 0 && concluidas.length === 0) {
    listaTarefas.innerHTML = '<p class="estado-vazio">Nenhuma tarefa nesta categoria.</p>';
    return;
  }

  pendentes.forEach((t) => listaTarefas.appendChild(criarLinhaTarefa(t)));

  if (concluidas.length > 0) {
    listaTarefas.appendChild(criarTituloSecao('Concluídas'));
    concluidas.forEach((t) => listaTarefas.appendChild(criarLinhaTarefa(t)));
  }
}

function agruparPorCategoria(lista) {
  return lista.reduce((acc, t) => {
    const chave = t.categoria || SEM_CATEGORIA;
    acc[chave] = acc[chave] || [];
    acc[chave].push(t);
    return acc;
  }, {});
}

function criarTituloSecao(texto) {
  const el = document.createElement('p');
  el.className = 'secao-titulo';
  el.textContent = texto;
  return el;
}

function criarLinhaTarefa(tarefa) {
  const concluida = tarefa.status === 'concluida';

  const linha = document.createElement('div');
  linha.className = 'tarefa-linha' + (concluida ? ' concluida' : '');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'tarefa-checkbox';
  checkbox.checked = concluida;
  checkbox.setAttribute('aria-label', `Marcar "${tarefa.titulo}" como ${concluida ? 'pendente' : 'concluída'}`);
  checkbox.addEventListener('change', () => aoAlternarConclusao(tarefa, checkbox.checked));

  const corpo = document.createElement('div');
  corpo.className = 'tarefa-corpo';

  const titulo = document.createElement('p');
  titulo.className = 'tarefa-titulo';
  titulo.textContent = tarefa.titulo;
  corpo.appendChild(titulo);

  if (tarefa.descricao) {
    const descricao = document.createElement('p');
    descricao.className = 'tarefa-descricao';
    descricao.textContent = tarefa.descricao;
    corpo.appendChild(descricao);
  }

  const acoes = document.createElement('div');
  acoes.className = 'tarefa-acoes';

  const btnEditar = document.createElement('button');
  btnEditar.type = 'button';
  btnEditar.textContent = 'Editar';
  btnEditar.addEventListener('click', () => abrirEdicao(tarefa));

  const btnExcluir = document.createElement('button');
  btnExcluir.type = 'button';
  btnExcluir.className = 'excluir';
  btnExcluir.textContent = 'Excluir';
  btnExcluir.addEventListener('click', () => aoExcluirTarefa(tarefa));

  acoes.appendChild(btnEditar);
  acoes.appendChild(btnExcluir);

  linha.appendChild(checkbox);
  linha.appendChild(corpo);
  linha.appendChild(acoes);

  return linha;
}

async function aoCriarTarefa(evento) {
  evento.preventDefault();
  const titulo = tituloInput.value.trim();
  if (!titulo) return;

  try {
    await api.criar({
      titulo,
      descricao: descricaoInput.value.trim(),
      categoria: categoriaInput.value.trim() || null,
    });
    tituloInput.value = '';
    descricaoInput.value = '';
    categoriaInput.value = '';
    esconderErro();
    await carregarTarefas();
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

async function aoAlternarConclusao(tarefa, marcarComoConcluida) {
  try {
    if (marcarComoConcluida) {
      await api.concluir(tarefa.id);
    } else {
      await api.reabrir(tarefa.id);
    }
    await carregarTarefas();
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

function aoExcluirTarefa(tarefa) {
  tarefaParaExcluir = tarefa;
  deleteTarefaTitulo.textContent = tarefa.titulo;
  deleteModal.show();
}

async function aoConfirmarExclusao() {
  if (!tarefaParaExcluir) return;

  try {
    await api.remover(tarefaParaExcluir.id);
    deleteModal.hide();
    tarefaParaExcluir = null;
    esconderErro();
    await carregarTarefas();
  } catch (erro) {
    deleteModal.hide();
    mostrarErro(erro.message);
  }
}

function abrirEdicao(tarefa) {
  document.getElementById('editId').value = tarefa.id;
  document.getElementById('editTitulo').value = tarefa.titulo;
  document.getElementById('editDescricao').value = tarefa.descricao || '';
  document.getElementById('editCategoria').value = tarefa.categoria || '';
  editModal.show();
}

async function aoSalvarEdicao(evento) {
  evento.preventDefault();
  const id = document.getElementById('editId').value;
  const titulo = document.getElementById('editTitulo').value.trim();
  const descricao = document.getElementById('editDescricao').value.trim();
  const categoria = document.getElementById('editCategoria').value.trim() || null;

  try {
    await api.atualizar(id, { titulo, descricao, categoria });
    editModal.hide();
    esconderErro();
    await carregarTarefas();
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

function mostrarErro(mensagem) {
  feedback.textContent = mensagem;
  feedback.hidden = false;
}

function esconderErro() {
  feedback.hidden = true;
}