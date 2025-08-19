describe('API ToDo List', () => {
  let idCriado;

  it('1. Deve criar uma nova tarefa', () => {
    cy.request('POST', 'http://localhost:3000/tarefas', {
      titulo: 'Estudar Cypress',
      descricao: 'Estudar comandos básicos',
      status: 'pendente',
      encerramento: '2025-12-31T23:59:59'
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('id');
      idCriado = res.body.id;
      cy.wrap(idCriado).as('idCriado');  // Usar wrap para garantir que o valor seja passado corretamente
    });
  });

  it('2. Deve listar todas as tarefas', () => {
    cy.request('GET', 'http://localhost:3000/tarefas').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  it('3. Deve buscar uma tarefa pelo ID', function() {
    cy.request('GET', `http://localhost:3000/tarefas/${this.idCriado}`).then((res) => {  // Acessando idCriado com this
      expect(res.status).to.eq(200);
      expect(res.body.titulo).to.eq('Estudar Cypress');
    });
  });

  it('4. Deve editar uma tarefa existente', function() {
    cy.request('PUT', `http://localhost:3000/tarefas/${this.idCriado}`, {  // Acessando idCriado com this
      status: 'concluída'
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.eq('concluída');
    });
  });

  it('5. Deve excluir uma tarefa pelo ID', function() {
    cy.request('DELETE', `http://localhost:3000/tarefas/${this.idCriado}`).then((res) => {  // Acessando idCriado com this
      expect(res.status).to.eq(204);
    });
  });
});
