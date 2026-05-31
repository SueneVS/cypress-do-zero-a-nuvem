describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    const longText = Cypress._.repeat("abcdefghijklmnopqrstuvwxyz", 10);
    cy.get("#firstName").type("Su");
    cy.get("#lastName").type("Souza");
    cy.get("#email").type("su@email.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.get("#firstName").type("Su");
    cy.get("#lastName").type("Souza");
    cy.get("#email").type("email-invalido");
    cy.get("#open-text-area").type("Obrigada!");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("valida se o campo de telefone continua vazio quando preenchido com um valor não numérico", () => {
    cy.get("#phone").type("numeroinvalido").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#firstName").type("Su");
    cy.get("#lastName").type("Souza");
    cy.get("#email").type("su@email.com");
    cy.get("#open-text-area").type("Obrigada");
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Su")
      .should("have.value", "Su")
      .clear()
      .should("have.value", "");

    cy.get("#lastName")
      .type("Souza")
      .should("have.value", "Souza")
      .clear()
      .should("have.value", "");

    cy.get("#email")
      .type("su@email.com")
      .should("have.value", "su@email.com")
      .clear()
      .should("have.value", "");

    cy.get("#phone")
      .type("991234567")
      .should("have.value", "991234567")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    const data = {
      firstName: "Su",
      lastName: "Souza",
      email: "su@gmail.com",
      text: "Obrigada!!",
    };

    cy.fillMandatoryFieldsAndSubmit(data);

    cy.get(".success").should("be.visible");
  });

  it("selecione um produto(YouTube) por seu texo", () => {
    cy.get("#product")
    .select("YouTube")
    .should("have.value", "youtube");
  });

  it("selecione um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product")
    .select("mentoria")
    .should("have.value", "mentoria");
  });

  it("selecione um produto (Blog) por seu índece", () => {
    cy.get("#product")
    .select(1)
    .should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]').each((typeOfService) => {
      cy.wrap(typeOfService)
        .check()
        .should("be.checked");
    });
  });

  it("marca mbos so checkboxes, depois desmarca o ultimo", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("be.not.checked");
  });

  it("seleciona um arquivo da psta fixtures", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json")
      .should((input) =>
        expect(input[0].files[0].name).to.equal("example.json"),
      );
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) =>
        expect(input[0].files[0].name).to.equal("example.json"),
      );
  });

  it("seleciona um arquivo utilizando uma fixture - criando um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get("#file-upload")
      .selectFile("@sampleFile")
      .should((input) =>
        expect(input[0].files[0].name).to.equal("example.json"),
      );
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "href", "privacy.html")
      .and("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.contains("a", "Política de Privacidade")
      .invoke("removeAttr", "target")
      .click();

    cy.contains("h1", "CAC TAT - Política de Privacidade").should("be.visible");
  });
});
