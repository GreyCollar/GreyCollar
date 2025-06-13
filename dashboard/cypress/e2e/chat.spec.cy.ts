import config from "../../config";

describe("Chat widget", () => {
  beforeEach(() => {
    cy.fixture("chat-page/teams.json").then((teams) => {
      cy.wrap(teams[0].id).as("teamId");
      cy.platformSetup(teams[0].id, "chat-page/teams.json", config);
      cy.viewport(1280, 720);
    });

    cy.get("@teamId").then(() => {
      cy.intercept("GET", `/api/colleagues`, {
        fixture: "chat-page/colleagues.json",
      });
    });

    cy.chatPageIntercept();

    cy.visit("/chat");
  });

  it("takes URL as input", () => {
    cy.typeMessageInput("/");

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("command-item-learn-url").click();

    cy.getBySel("input-item-Alex").click();

    cy.getBySel("input-component").should("be.visible");

    cy.getBySel("message-input").focus();

    cy.getBySel("input-component").eq(1).type("www.google.com");

    cy.intercept("POST", `/api/knowledge`, {
      fixture: "knowledges/create/knowledges.url.post.json",
    });

    cy.intercept(
      "GET",
      `/api/colleagues/72ef5b08-b4a9-42b7-bb0a-22d40e56798b`,
      {
        fixture: "chat-page/colleague.json",
      }
    );

    cy.getBySel("send-button").click();

    cy.getBySel("system-card").last().scrollIntoView();

    cy.getBySel("system-card").last().should("be.visible");
  });

  it("takes QA as input", () => {
    cy.typeMessageInput("/");

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("command-item-learn-qa").click();

    cy.getBySel("input-item-Alex").click();

    cy.getBySel("input-component").should("be.visible");

    cy.getBySel("input-component").eq(1).type("What is the capital of India?");

    cy.getBySel("message-input").focus();

    cy.useKeyboard("Tab");

    cy.getBySel("input-component").eq(2).type("New Delhi");

    cy.intercept("POST", `/api/knowledge`, {
      fixture: "knowledges/create/knowledges.qa.post.json",
    });

    cy.getBySel("send-button").click();

    cy.getBySel("system-card").last().scrollIntoView();

    cy.getBySel("system-card").last().should("be.visible");
  });

  it("takes TEXT as input", () => {
    cy.typeMessageInput("/");

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("command-item-learn-text").click();

    cy.getBySel("input-item-Alex").click();

    cy.getBySel("input-component").should("be.visible");

    cy.getBySel("message-input").focus();

    cy.getBySel("input-component").eq(1).type("How are you?");

    cy.intercept("POST", `/api/knowledge`, {
      fixture: "knowledges/create/knowledges.text.post.json",
    });

    cy.intercept(
      "GET",
      `/api/colleagues/72ef5b08-b4a9-42b7-bb0a-22d40e56798b`,
      {
        fixture: "chat-page/colleague.json",
      }
    );

    cy.getBySel("send-button").click();

    cy.getBySel("system-card").last().scrollIntoView();

    cy.getBySel("system-card").last().should("be.visible");
  });

  it("runs conditional input flow", () => {
    cy.typeMessageInput("/");

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("command-item-learn").click();

    cy.getBySel("input-item-Alex").click();

    cy.getBySel("input-component").should("be.visible");

    cy.getBySel("message-input").focus();

    cy.getBySel("input-item-URL").click();

    cy.getBySel("input-component").eq(2).should("be.visible");

    cy.getBySel("input-component").eq(2).type("www.google.com");

    cy.intercept("POST", `/api/knowledge`, {
      fixture: "knowledges/create/knowledges.url.post.json",
    });

    cy.intercept(
      "GET",
      `/api/colleagues/72ef5b08-b4a9-42b7-bb0a-22d40e56798b`,
      {
        fixture: "chat-page/colleague.json",
      }
    );

    cy.getBySel("send-button").click();

    cy.getBySel("system-card").last().scrollIntoView();

    cy.getBySel("system-card").last().should("be.visible");
  });

  it("complete command story with keyboard only", () => {
    cy.typeMessageInput("/");

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.useKeyboard("ArrowDown");
    cy.useKeyboard("ArrowDown");
    cy.useKeyboard("Enter");

    cy.useKeyboard("ArrowDown");
    cy.useKeyboard("Enter");

    cy.getBySel("input-component").should("be.visible");
    cy.getBySel("input-component").eq(1).type("www.google.com");

    cy.intercept("POST", `/api/knowledge`, {
      fixture: "knowledges/create/knowledges.url.post.json",
    });

    cy.intercept(
      "GET",
      `/api/colleagues/72ef5b08-b4a9-42b7-bb0a-22d40e56798b`,
      {
        fixture: "chat-page/colleague.json",
      }
    );

    cy.getBySel("message-input").type("{enter}");

    cy.getBySel("system-card").last().scrollIntoView();

    cy.getBySel("system-card").last().should("be.visible");
  });

  it("answers supervising", () => {
    cy.getBySel("reply-button").last().click();

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.typeMessageInput("We are 7/24 coffee shop");

    cy.intercept(
      "PATCH",
      `/api/supervisings/d92da3ee-521c-4b93-9770-c38dcea173a5`,
      {
        fixture: "supervising/supervising.status.answered.json",
      }
    );

    cy.intercept(
      "GET",
      `/api/supervisings/d92da3ee-521c-4b93-9770-c38dcea173a5`,
      {
        fixture: "supervising/supervising.status.json",
      }
    );

    cy.getBySel("send-button").click();
  });

  it("sorts by date", () => {
    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.typeMessageInput("We are 7/24 coffee shop");

    cy.intercept("POST", `/api/messages`, {
      fixture: "chat-page/messages/messages.json",
    });

    cy.intercept("GET", `/api/supervisings`, {
      fixture: "supervising/supervising.date.json",
    });

    cy.getBySel("send-button").click();
  });

  it("sends message", () => {
    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.typeMessageInput("Hello");

    cy.intercept("POST", `/api/messages`, {
      fixture: "chat-page/messages/message.post.json",
    });

    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("send-button").click();

    cy.waitEvent("MESSAGE_CREATED");

    cy.getBySel("message-item")
      .last()
      .should("have.attr", "data-status", "READ");
  });

  it("receives message", () => {
    cy.intercept("POST", `/api/messages`, {
      fixture: "chat-page/messages/message.system.post.json",
    });

    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.system.get.json",
    });

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });
  });

  it("updates message status", () => {
    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("message-item")
      .last()
      .should("have.attr", "data-status", "READ");

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.intercept("PATCH", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/message.patch.json",
    });

    cy.waitEvent("MESSAGE_STATUS_UPDATED");

    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.patch.json",
    });

    cy.getBySel("message-item").last().should("contain", "Have a good day");

    cy.getBySel("message-item")
      .last()
      .should("have.attr", "data-status", "READ");
  });

  it("shows system messages", () => {
    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.getBySel("supervising-message").scrollIntoView();
    cy.getBySel("knowledge-message").last().scrollIntoView();
  });

  it("replies message", () => {
    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.intercept("GET", `/api/messages?offset=2023-08-05T13:10:00.000Z`, {
      fixture: "chat-page/messages/messages.get.json",
    });

    cy.intercept("GET", `/api/commands`, {
      fixture: "chat-page/commands.json",
    });

    cy.intercept("GET", `/api/tasks`, {
      fixture: "tasks/task.json",
    });

    cy.getBySel("message-content").eq(0).scrollIntoView();

    cy.getBySel("message-content").eq(0).trigger("mouseover");

    cy.getBySel("reply-button").eq(0).click({ force: true });

    cy.getBySel("message-input").focus();

    cy.typeMessageInput("How are you?");

    cy.intercept("POST", `/api/messages`, {
      fixture: "chat-page/messages/messages.reply.post.json",
    });

    cy.intercept("GET", `/api/messages`, {
      fixture: "chat-page/messages/messages.reply.json",
    });

    cy.getBySel("send-button").click();
  });
});
