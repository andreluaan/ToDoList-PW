
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categorias (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tarefas (
  id           TEXT PRIMARY KEY,                 -- UUID gerado pela aplicação
  titulo       TEXT NOT NULL,
  descricao    TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida')),
  categoria_id INTEGER,                           -- pode ser NULL (tarefa sem categoria)
  criado_em    TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tarefas_categoria_id ON tarefas(categoria_id);