const express = require('express');
const path = require('path');
const app = express();

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Habilita o uso do corpo da requisição (JSON)
app.use(express.json());

// Armazenamento temporário das tarefas (em memória)
let tarefas = [];
let idAtual = 1;

// Rota para criar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const { titulo, descricao, status, encerramento } = req.body;
  const novaTarefa = { id: idAtual++, titulo, descricao, status: status || "pendente", encerramento };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);  // Retorna a tarefa criada
});

// Rota para buscar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);  // Retorna a lista de todas as tarefas
});

// Rota para buscar uma tarefa específica por ID
app.get('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id == req.params.id);
  if (!tarefa) return res.status(404).send('Tarefa não encontrada');
  res.json(tarefa);  // Retorna a tarefa encontrada
});

// Rota para atualizar o status de uma tarefa
app.put('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find(t => t.id == req.params.id);
  if (!tarefa) return res.status(404).send('Tarefa não encontrada');
  
  // Atualiza o status da tarefa
  tarefa.status = req.body.status || tarefa.status;
  res.json(tarefa);  // Retorna a tarefa atualizada
});

// Rota para excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const tarefaIndex = tarefas.findIndex(t => t.id == req.params.id);
  if (tarefaIndex === -1) return res.status(404).send('Tarefa não encontrada');
  
  // Remove a tarefa do array
  tarefas.splice(tarefaIndex, 1);
  res.status(204).send();  // Retorna sucesso na exclusão (sem conteúdo)
});

// Define a porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
