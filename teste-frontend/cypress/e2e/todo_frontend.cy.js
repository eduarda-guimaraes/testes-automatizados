describe('ToDo List - Frontend SPA', () => {
  let idCriado;
  const tarefa = {
    titulo: 'Testar Cypress',
    descricao: 'Fazer testes end-to-end',
    encerramento: '2025-12-31T23:59'
  };

  before(() => {
    cy.visit('http://localhost:3000'); // Acessa a página do frontend
  });

  it('1. Deve criar uma nova tarefa', () => {
    cy.get('#titulo').type(tarefa.titulo);
    cy.get('#descricao').type(tarefa.descricao);
    cy.get('#encerramento').type(tarefa.encerramento);
    cy.get('#btn-criar').click();

    // Espera que a tarefa apareça na lista de pendentes após criação
    cy.get('#tarefas-pendentes', { timeout: 10000 }).should('contain', tarefa.titulo)
      .then(() => {
        // Aqui extraímos o ID da tarefa da lista, se necessário
        cy.get('#tarefas-pendentes li').first().then((task) => {
          const taskText = task.text();
          const id = taskText.split('-')[0]; // Ajuste conforme necessário para o formato do texto
          idCriado = id.trim(); // Salva o ID da tarefa criada
          cy.wrap(idCriado).as('idCriado'); // Usa o wrap para garantir que o ID seja acessado corretamente nos outros testes
        });
      });
  });

  it('2. Deve exibir tarefas pendentes', () => {
    // Espera que a tarefa criada apareça na lista de pendentes
    cy.get('#tarefas-pendentes').should('contain', tarefa.titulo);
  });

  it('3. Deve exibir todas as tarefas', () => {
    // Espera que a tarefa criada apareça na lista de todas as tarefas
    cy.get('#tarefas-geral').should('contain', tarefa.titulo);
  });

  it('4. Deve buscar tarefa específica por ID', function() {
    cy.get('#busca-id').type(this.idCriado); // Usa o ID da tarefa criada
    cy.get('#btn-buscar').click();

    // Espera a tarefa aparecer na busca
    cy.get('#busca-especifica').should('contain', tarefa.titulo);
  });

  it('5. Deve alterar status da tarefa', function() {
    // Espera a tarefa aparecer, e clica em "Concluir"
    cy.contains(tarefa.titulo).parent().contains('Concluir').click();

    // Espera até a tarefa ser concluída
    cy.get(`#tarefas-geral li`).contains(tarefa.titulo).should('contain', 'concluída');
  });

  it('6. Deve excluir uma tarefa', function() {
    // Espera até a tarefa aparecer, e clica em "Excluir"
    cy.contains(tarefa.titulo).parent().contains('Excluir').click();

    // Espera que a tarefa seja excluída
    cy.get('#tarefas-geral').should('not.contain', tarefa.titulo);
  });
});
