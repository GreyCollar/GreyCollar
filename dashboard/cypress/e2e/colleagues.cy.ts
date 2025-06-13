import config from "../../config";

describe("Colleagues page", () => {
  beforeEach(() => {
    cy.fixture("colleagues-page/teams.json").then((teams) => {
      cy.wrap(teams[1].id).as("teamId");
      cy.platformSetup(teams[1].id, "colleagues-page/team.json", config);
      cy.viewport(1280, 720);
    });

    cy.fixture("colleagues-page/colleagues.json").as("colleagues");

    cy.fixture("colleagues-page/create/colleagues.get.json").as(
      "newColleagues"
    );
    cy.fixture("colleagues-page/create/colleague.post.json").as(
      "createdColleague"
    );
    cy.fixture("colleagues-page/edit/colleagues.get.json").as(
      "colleaguesWithEditedColleague"
    );
    cy.fixture("colleagues-page/edit/colleague.put.json").as("editedColleague");

    cy.fixture("colleagues-page/delete/colleagues.get.json").as(
      "colleaguesWithDeletedColleague"
    );
  });

  it("add a new colleague", function () {
    cy.visit("/colleagues");

    cy.setColleagueIntercept();

    cy.getBySel("add-new-button").click();

    cy.waitEvent("COLLEAGUE_WIZARD_OPENED");

    cy.createColleagueViaDialog(this.createdColleague, this.newColleagues);

    cy.waitEvent("COLLEAGUE_ADDED");

    cy.getBySel("colleague-card").should("have.length", 3);

    this.newColleagues.forEach((colleague, index) => {
      cy.verifyColleagueCard(colleague, index);
    });
  });

  it("edits a colleague", function () {
    cy.visit("/colleagues");

    cy.setColleagueIntercept();

    cy.getBySel("colleague-card-more-vert").eq(1).first().click();

    cy.getBySel("colleague-card-menu-edit").click();

    cy.editColleagueViaDialog(
      this.editedColleague,
      this.colleaguesWithEditedColleague
    );

    cy.waitEvent("COLLEAGUE_UPDATED");

    //eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000); //TODO remove this when refactor hooks

    this.colleaguesWithEditedColleague.forEach((colleague, index) => {
      cy.verifyColleagueCard(colleague, index);
    });
  });

  it("deletes a colleague", function () {
    cy.visit("/colleagues");

    cy.setColleagueIntercept();

    cy.fixture("colleagues-page/delete/colleagues.delete.json").then(
      (colleague) => {
        cy.intercept("DELETE", `/api/colleagues/` + colleague.id, {
          fixture: "colleagues-page/delete/colleagues.delete.json",
        }).as("deleteColleague");
      }
    );

    cy.fixture("colleagues-page/delete/colleagues.get.json").then(
      (colleague) => {
        cy.intercept("GET", `/api/colleagues/${colleague.id}`, {
          fixture: "colleagues-page/delete/colleagues.get.json",
        }).as("getColleagues");
      }
    );

    cy.intercept("GET", `/api/colleagues`, {
      fixture: "colleagues-page/delete/colleagues.get.json",
    }).as("getColleagues");

    cy.getBySel("colleague-card-more-vert").eq(0).first().click();

    cy.getBySel("colleague-card-menu-delete").click();

    cy.getBySel("confirm").click();

    cy.waitEvent("COLLEAGUE_DELETED");

    cy.wait("@getColleagues");

    cy.getBySel("colleague-card").should("have.length", 1);

    this.colleaguesWithDeletedColleague.forEach((colleague, index) => {
      cy.verifyColleagueCard(colleague, index);
    });
  });

  it("visits the colleague page", function () {
    cy.visit("/colleagues");

    cy.setColleagueIntercept();

    cy.fixture("colleagues-page/colleagues.json").then((colleague) => {
      cy.intercept("GET", `/api/colleagues/${colleague[0].id}`, {
        fixture: "colleagues-page/colleague.json",
      }).as("getColleague");
    });

    cy.getBySel("colleague-card-more-vert").eq(0).first().click();

    cy.getBySel("colleague-card-menu-view").click();

    cy.checkRoute(`/colleagues/${this.colleagues[0].id}`);
  });
});
