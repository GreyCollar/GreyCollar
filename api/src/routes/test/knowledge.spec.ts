import * as test from "@canmingir/link-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";
import { subscribe } from "../../lib/Event";

describe("Knowledge service", () => {
  beforeEach(async () => test.reset());

  it("creates QA type knowledge", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app)
      .post("/knowledge")
      .send({
        type: "QA",
        question: "What time does the store close in weekends?",
        answer: "The store closes 5pm in weekends",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(201)
      .catch(done);

    subscribe("KNOWLEDGE_CREATED", (knowledge) => {
      deepEqual(knowledge, {
        id: knowledge.id,
        type: "QA",
        question: "What time does the store close in weekends?",
        answer: "The store closes 5pm in weekends",
        url: null,
        text: null,
        content: null,
        status: "COMPLETED",
        createdAt: knowledge.createdAt,
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
        taskId: null,
        teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
      });
      done();
    });
  });

  it("creates URL type knowledge", (done) => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    request(app)
      .post("/knowledge")
      .send({
        type: "URL",
        url: "https://www.selenium.dev/selenium/web/window_switching_tests/simple_page.html",
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      })
      .expect(201)
      .catch(done);

    subscribe("KNOWLEDGE_CREATED", (knowledge) => {
      deepEqual(knowledge, {
        id: knowledge.id,
        type: "URL",
        url: "https://www.selenium.dev/selenium/web/window_switching_tests/simple_page.html",
        text: null,
        content:
          "\n        URL: https://www.selenium.dev/selenium/web/window_switching_tests/simple_page.html\n        Title: Simple Page\n        Content: Simple page with simple test.\n      ",
        status: "COMPLETED",
        createdAt: knowledge.createdAt,
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
        taskId: null,
        teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
      });
      done();
    });
  });

  it("creates TEXT type knowledge", (done) => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    request(app)
      .post("/knowledge")
      .send({
        type: "TEXT",
        text: "Avaible Positions",
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      })
      .expect(201)
      .catch(done);

    subscribe("KNOWLEDGE_CREATED", (knowledge) => {
      deepEqual(knowledge, {
        id: knowledge.id,
        type: "TEXT",
        url: null,
        content: null,
        text: "Avaible Positions",
        status: "COMPLETED",
        createdAt: knowledge.createdAt,
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
        taskId: null,
        teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
      });
      done();
    });
  });

  it("gets all knowledge", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app).get("/knowledge").expect(200).catch(done);

    subscribe("KNOWLEDGES_LOADED", (knowledge) => {
      deepEqual(knowledge, [
        {
          Task: null,
          answer: null,
          colleagueId: null,
          content: null,
          createdAt: new Date("1970-01-20T22:08:14.307Z"),
          id: "0b6e8e55-3d02-4f59-966f-e6339ba27095",
          question: null,
          status: "COMPLETED",
          taskId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
          text: null,
          type: "URL",
          url: "https://www.financialmanagementandstrategy.com/resources",
        },
        {
          id: "17f4a185-c81c-4be5-a6ee-fdd38fdb2b1a",
          type: "QA",
          question:
            "What are the key components of an effective financial strategy?",
          answer:
            "The key components of an effective financial strategy include budgeting, forecasting, risk management, investment planning, and performance measurement.",
          url: null,
          text: null,
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.307Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
        {
          id: "81a97af4-75ce-473c-9106-2bdfb86abf80",
          type: "URL",
          question: null,
          answer: null,
          url: "https://www.customerservicebestpractices.com/resources",
          text: null,
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.324Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
        {
          id: "eab826a3-2566-4ac9-abaf-c3a31b947059",
          type: "TEXT",
          question: null,
          answer: null,
          url: null,
          text: "In-progress report on customer service trends and improvements.",
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.324Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
      ]);
      done();
    });
  });

  it("gets knowledge by colleagueId query", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app)
      .get("/knowledge?colleagueId=72ef5b08-b4a9-42b7-bb0a-22d40e56798b")
      .expect(200)
      .catch(done);

    subscribe("KNOWLEDGES_LOADED", (knowledge) => {
      deepEqual(knowledge, [
        {
          id: "0b6e8e55-3d02-4f59-966f-e6339ba27095",
          type: "URL",
          question: null,
          answer: null,
          url: "https://www.financialmanagementandstrategy.com/resources",
          text: null,
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.307Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
        {
          id: "8a743824-3a4c-4d96-b235-34a2f0c19dd0",
          type: "TEXT",
          question: null,
          answer: null,
          url: null,
          text: "Latest trends in financial management and strategy.",
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.337Z"),
          Task: null,
          colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
          teamId: null,
        },
        {
          id: "17f4a185-c81c-4be5-a6ee-fdd38fdb2b1a",
          type: "QA",
          question:
            "What are the key components of an effective financial strategy?",
          answer:
            "The key components of an effective financial strategy include budgeting, forecasting, risk management, investment planning, and performance measurement.",
          url: null,
          text: null,
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.307Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
        {
          id: "81a97af4-75ce-473c-9106-2bdfb86abf80",
          type: "URL",
          question: null,
          answer: null,
          url: "https://www.customerservicebestpractices.com/resources",
          text: null,
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.324Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
        {
          id: "eab826a3-2566-4ac9-abaf-c3a31b947059",
          type: "TEXT",
          question: null,
          answer: null,
          url: null,
          text: "In-progress report on customer service trends and improvements.",
          content: null,
          taskId: null,
          status: "COMPLETED",
          createdAt: new Date("1970-01-20T22:08:14.324Z"),
          Task: null,
          colleagueId: null,
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        },
      ]);
      done();
    });
  });

  it("deletes knowledge", async () => {
    await request(app)
      .delete("/knowledge/9a1c0eb7-5ada-44e9-bd84-0f55943809b8")
      .expect(204);

    await request(app)
      .get("/knowledge/9a1c0eb7-5ada-44e9-bd84-0f55943809b8")
      .expect(404);
  });

  it("should return 400 when creating QA type knowledge with only answer", async () => {
    await request(app)
      .post("/knowledge")
      .send({
        type: "QA",
        answer: "The store closes at 5pm on weekends",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(500);
  });

  it("should return 400 when creating QA type knowledge with only question", async () => {
    await request(app)
      .post("/knowledge")
      .send({
        type: "QA",
        question: "What time does the store close on weekends?",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(500);
  });

  it("should return 400 when creating TEXT type knowledge with invalid input", async () => {
    await request(app)
      .post("/knowledge")
      .send({
        type: "TEXT",
        url: "The store closes at 5pm on weekends",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(400);
  });

  it("should return 400 when creating URL type knowledge with invalid input", async () => {
    await request(app)
      .post("/knowledge")
      .send({
        type: "URL",
        text: "The store closes at 5pm on weekends",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(201);
  });

  it("should return 400 when creating QA type knowledge with colleagueId and teamId", async () => {
    await request(app)
      .post("/knowledge")
      .send({
        type: "QA",
        question: "What time does the store close on weekends?",
        answer: "The store closes at 5pm on weekends",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
        teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
      })
      .expect(201);
  });

  it("should return 400 when creating QA type knowledge with QA and text", async () => {
    await request(app)
      .post("/knowledge")
      .send({
        type: "QA",
        question: "What time does the store close on weekends?",
        answer: "The store closes at 5pm on weekends",
        text: "Avaible Positions",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(201);
  });
});
