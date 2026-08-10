const express = require('express');
const TarefaRoutes = require('./routes/TarefaRoutes');

const app = express();
app.use(express.json());

app.use('/tarefas', TarefaRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', mensagem: 'API To-Do List no ar' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});