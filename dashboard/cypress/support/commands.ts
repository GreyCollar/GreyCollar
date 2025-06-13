declare namespace Cypress {
  interface Chainable {
    createColleagueViaDialog(
      colleague: {
        name: string;
        character: string;
        role: string;
        title: string;
        avatar: string;
      },
      newColleaguesFixture: string
    ): Chainable<void>;

    editColleagueViaDialog(
      colleague: {
        id: string;
        name: string;
        character: string;
        role: string;
        title: string;
        avatar: string;
      },
      newColleagues: string
    ): Chainable<void>;

    setColleagueIntercept(): Chainable<void>;

    chatPageIntercept(): Chainable<void>;

    verifyColleagueCard(
      colleague: {
        character: string;
        role: string;
        name: string;
        AIEngine: {
          vendor: string;
          model: string;
        };
      },
      index: number
    ): Chainable<void>;

    typeMessageInput(text: string): Chainable<void>;

    useKeyboard(
      key: "ArrowUp" | "ArrowDown" | "Enter" | "Tab"
    ): Chainable<void>;

    waitEvent(eventName: string, timeout?: number): Chainable<void>;

    getBySel(selector: string): Chainable<JQuery<HTMLElement>>;

    selectIconFromPicker(icon: string): Chainable<void>;

    storageGet(key: string): Chainable<string | null>;

    storageSet(key: string, value: string): Chainable<void>;

    platformSetup(
      itemId: string,
      itemFixturePath: string,
      config: { name: string }
    ): Chainable<void>;

    checkRoute(route: string): Chainable<void>;
  }
}

Cypress.Commands.add(
  "createColleagueViaDialog",
  (colleague, newColleaguesFixture) => {
    const { name, character, title, role, avatar } = colleague;

    cy.getBySel("colleague-wizard-name-input").click();

    cy.getBySel("name").type(name, {
      force: true,
    });

    cy.getBySel("avatar-select-button").click();

    cy.getBySel("avatar-selection").should("be.visible");

    cy.selectIconFromPicker(avatar);

    cy.getBySel("colleague-next-button").click();

    cy.getBySel("colleague-wizard-title-input").type(title);

    cy.getBySel("colleague-wizard-role-input").type(role);

    cy.getBySel("colleague-next-button").click();

    cy.get('[data-cy="character"]').type(character, {
      force: true,
    });

    cy.getBySel("colleague-next-button").click();

    cy.getBySel("ai-marketplace-item").eq(1).click();

    cy.intercept("POST", `/api/colleagues`, colleague);

    cy.storageGet("itemId").then(() => {
      cy.intercept("GET", "/api/colleagues", newColleaguesFixture);
    });

    cy.getBySel("colleague-finish-button").click();

    cy.waitEvent("COLLEAGUE_ADDED");
  }
);

Cypress.Commands.add("editColleagueViaDialog", (colleague, newColleagues) => {
  const { id, name, character, role, title, avatar } = colleague;

  cy.getBySel("name").clear();

  cy.getBySel("name").type(name, {
    force: true,
  });

  cy.getBySel("avatar-select-button").click();

  cy.getBySel("avatar-selection").should("be.visible");

  cy.selectIconFromPicker(avatar);

  cy.getBySel("colleague-next-button").click();

  cy.getBySel("colleague-wizard-title-input").clear();
  cy.getBySel("colleague-wizard-title-input").type(title);

  cy.getBySel("colleague-wizard-role-input").clear();
  cy.getBySel("colleague-wizard-role-input").type(role);

  cy.getBySel("colleague-next-button").click();

  cy.getBySel("character").clear();

  cy.get('[data-cy="character"]').type(character, {
    force: true,
  });

  cy.getBySel("colleague-next-button").click();

  cy.getBySel("ai-marketplace-item").eq(1).click();

  cy.intercept("PUT", `/api/colleagues/${id}`, colleague);

  cy.storageGet("itemId").then(() => {
    cy.intercept("GET", "/api/colleagues", newColleagues);
  });

  cy.getBySel("colleague-finish-button").click();

  cy.waitEvent("COLLEAGUE_UPDATED");
});

Cypress.Commands.add("setColleagueIntercept", () => {
  cy.storageGet("itemId").then(() => {
    cy.intercept("GET", `/api/projects`, {
      fixture: `colleagues-page/team.json`,
    });
    cy.intercept("GET", `/api/colleagues`, {
      fixture: `colleagues-page/colleagues.json`,
    });

    cy.intercept("GET", `/api/engines`, {
      fixture: `colleagues-page/engines.json`,
    });

    cy.intercept("GET", `/api/organizations`, {
      fixture: `organizations/organization.json`,
    });
  });
});

Cypress.Commands.add("chatPageIntercept", () => {
  cy.intercept(
    "GET",
    `/api/supervisings/d92da3ee-521c-4b93-9770-c38dcea173a5`,
    {
      fixture: "supervising/supervising.get.json",
    }
  );

  cy.intercept("GET", "/api/projects/e6d4744d-a11b-4c75-acad-e24a02903729", {
    fixture: "chat-page/team.json",
  });

  cy.intercept("GET", `/api/knowledge/eab826a3-2566-4ac9-abaf-c3a31b947059`, {
    fixture: "knowledges/knowledge.single.json",
  });

  cy.intercept("GET", `/api/colleagues/72ef5b08-b4a9-42b7-bb0a-22d40e56798b`, {
    fixture: "chat-page/colleague.json",
  });

  cy.intercept("GET", `/api/messages`, {
    fixture: "chat-page/messages/messages.json",
  });
});

Cypress.Commands.add("verifyColleagueCard", (colleague, index) => {
  const { character, role, name } = colleague;

  cy.getBySel("colleague-card-character-area")
    .eq(index)
    .then((characterArea) => {
      expect(characterArea).to.have.text(character);
    });
  cy.getBySel("colleague-card-role-area")
    .eq(index)
    .then((roleAre) => {
      expect(roleAre).to.have.text(role);
    });

  cy.getBySel("colleague-card-name")
    .eq(index)
    .then((nameAre) => {
      expect(nameAre).to.have.text(name);
    });

  cy.getBySel("colleague-card-generated-by")
    .eq(index)
    .should(
      "have.text",
      `Generated By ${colleague.AIEngine.vendor} ${colleague.AIEngine.model}`
    );
});

Cypress.Commands.add("typeMessageInput", (text) => {
  //eslint-disable-next-line
  cy.wait(2000);

  cy.getBySel("message-input").focus();
  cy.getBySel("message-input").click({ force: true });
  cy.getBySel("message-input").type(text, { force: true });
});

Cypress.Commands.add("useKeyboard", (key) => {
  switch (key) {
    case "ArrowUp":
      cy.focused().trigger("keydown", {
        keyCode: 38,
        which: 38,
        shiftKey: false,
        ctrlKey: false,
      });
      break;
    case "ArrowDown":
      cy.focused().trigger("keydown", {
        keyCode: 40,
        which: 40,
        shiftKey: false,
        ctrlKey: false,
      });
      break;
    case "Enter":
      cy.focused().trigger("keydown", {
        keyCode: 13,
        which: 13,
        shiftKey: false,
        ctrlKey: false,
      });
      break;
    case "Tab":
      cy.focused().trigger("keydown", {
        keyCode: 9,
        which: 9,
        shiftKey: false,
        ctrlKey: false,
      });
      break;
  }
});

Cypress.Commands.add("waitEvent", (eventName, timeout = 20000) => {
  cy.window({ timeout }).then((window) => {
    const { Event } = window["@nucleoidai"];

    return new Cypress.Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new Error(`Event ${eventName} did not fire within ${timeout}ms`)
        );
      }, timeout);

      Event.subscribe(eventName, (payload) => {
        clearTimeout(timer);
        cy.log("react-event", eventName, payload);
        resolve();
      });
    });
  });
});
