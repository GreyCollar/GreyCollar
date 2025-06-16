import config from "../../config";

describe("Organization chart", () => {
  beforeEach(() => {
    cy.fixture("organizations/team.json").then((teams) => {
      cy.wrap(teams.id).as("teamId");
      cy.platformSetup(teams.id, "organizations/team.json", config);
      cy.viewport(1280, 720);
    });
    cy.fixture("organizations/team.json").as("project");

    cy.intercept("GET", `/api/projects/add6dfa4-45ba-4da2-bc5c-5a529610b52f`, {
      fixture: "organizations/team.json",
    });

    cy.intercept(
      "GET",
      `/api/organizations/dfb990bb-81dd-4584-82ce-050eb8f6a12f`,
      {
        fixture: "organizations/organization.json",
      }
    );

    cy.fixture("colleagues-page/create/colleagues.team.get.json").as(
      "newColleagues"
    );
    cy.fixture("colleagues-page/create/colleague.team.post.json").as(
      "createdColleague"
    );

    cy.intercept("GET", "/api/responsibilities", {
      fixture: "responsibilities/responsibilities.get.json",
    });

    cy.fixture("colleagues-page/colleague.json").as("colleague");
  });
  it("adds new colleague", function () {
    cy.visit("/");

    cy.setColleagueIntercept();

    cy.intercept("GET", "/api/engines", {
      fixture: "colleagues-page/engines.json",
    });

    cy.getBySel("organization-button").click();

    cy.getBySel("team-chart").should("be.visible");

    cy.getBySel("add-colleague-button").should("be.visible");

    cy.getBySel("add-colleague-button").eq(0).click();

    cy.intercept("GET", `/api/organizations/${this.project.organizationId}`, {
      fixture: "organizations/organization.get.json",
    });

    cy.createColleagueViaDialog(this.createdColleague, this.newColleagues);

    cy.waitEvent("COLLEAGUE_ADDED");
  });

  it("opens responsibility drawer", function () {
    cy.visit("/team");

    cy.setColleagueIntercept();

    cy.getBySel("team-chart").should("be.visible");

    cy.getBySel("responsibility-button").click();
  });

  it("opens colleague page", function () {
    cy.visit("/team");

    cy.setColleagueIntercept();

    cy.getBySel("team-chart").should("be.visible");

    cy.intercept("GET", `/api/colleagues/${this.colleague.id}`, this.colleague);

    cy.getBySel("colleague-page-button").click();
  });
});
