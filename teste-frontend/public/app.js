const API_URL = "http://localhost:3000/tarefas";

// Criar nova tarefa
document.getElementById('btn-criar').addEventListener('click', () => {
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const encerramento = document.getElementById('encerramento').value;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, encerramento, status: "pendente" })
  }).then(() => carregarTarefas());
});

// Buscar tarefa por ID
document.getElementById('btn-buscar').addEventListener('click', () => {
  const id = document.getElementById('busca-id').value;
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(tarefa => {
      const ul = document.getElementById('busca-especifica');
      ul.innerHTML = `<li>${tarefa.titulo} - ${tarefa.status}</li>`;
    });
});

// Carregar todas as tarefas
function carregarTarefas() {
  fetch(API_URL)
    .then(res => res.json())
    .then(tarefas => {
      const pendentes = document.getElementById('tarefas-pendentes');
      const geral = document.getElementById('tarefas-geral');
      pendentes.innerHTML = "";
      geral.innerHTML = "";

      tarefas.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${t.titulo}</strong> - ${t.status}
          <button onclick="alterarStatus(${t.id})">Concluir</button>
          <button onclick="excluirTarefa(${t.id})">Excluir</button>
        `;
        geral.appendChild(li);

        if (t.status === "pendente") {
          const liPend = document.createElement('li');
          liPend.textContent = `${t.titulo} - ${t.descricao}`;
          pendentes.appendChild(liPend);
        }
      });
    });
}

// Alterar status da tarefa para "concluída"
function alterarStatus(id) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "concluída" })
  }).then(() => carregarTarefas());  // Atualiza as tarefas após a alteração
}

// Excluir tarefa
function excluirTarefa(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => carregarTarefas());  // Atualiza as tarefas após a exclusão
}

// Inicializa a página carregando as tarefas
carregarTarefas();
