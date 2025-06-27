import * as test from "@nucleoidai/platform-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";
import { subscribe } from "../../lib/Event";

describe("Supervisings service", () => {
  beforeEach(async () => test.reset());

  it("create a new supervise", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app)
      .post("/supervisings")
      .send({
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(201)
      .catch(done);

    subscribe("SUPERVISING", "RAISED", (supervising) => {
      deepEqual(supervising, {
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
        question: "What time do you close?",
      });
      done();
    });
  });

  it("gets supervisings by colleagueId", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    const { body } = await request(app)
      .get("/colleagues/72ef5b08-b4a9-42b7-bb0a-22d40e56798b/supervisings")
      .expect(200);

    deepEqual(body, [
      {
        id: "d92da3ee-521c-4b93-9770-c38dcea173a5",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        question: "What time do you close?",
        answer: null,
        status: "IN_PROGRESS",
        createdAt: "2023-08-06T12:00:00.000Z",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      },
    ]);
  });

  it("answer a supervise", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app)
      .patch(`/supervisings/d92da3ee-521c-4b93-9770-c38dcea173a5`)
      .send({
        answer: "This is answer",
        status: "ANSWERED",
      })
      .expect(200)
      .catch(done);

    subscribe("SUPERVISING", "ANSWERED", (supervising) => {
      deepEqual(supervising, {
        supervisingId: "d92da3ee-521c-4b93-9770-c38dcea173a5",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        question: "What time do you close?",
        answer: "This is answer",
        status: "ANSWERED",
        teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      });
      done();
    });
  });

  it("gets supervising with IN_PROGRESS status", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app)
      .get("/supervisings")
      .query({ status: "IN_PROGRESS" })
      .expect(200)
      .catch(done);

    subscribe("SUPERVISING_LOADED", (supervisings) => {
      deepEqual(supervisings, {
        id: "d92da3ee-521c-4b93-9770-c38dcea173a5",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        question: "What time do you close?",
        answer: null,
        createdAt: "2023-08-06T12:00:00.000Z",
        status: "IN_PROGRESS",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      });
      done();
    });
  });

  it("get team supervisings", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app).get("/supervisings").expect(200).catch(done);

    subscribe("SUPERVISING_LOADED", (supervisings) => {
      deepEqual(supervisings.length, 1);
      deepEqual(supervisings[0].dataValues, {
        id: "d92da3ee-521c-4b93-9770-c38dcea173a5",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        question: "What time do you close?",
        answer: null,
        status: "IN_PROGRESS",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
        createdAt: new Date("2023-08-06T12:00:00.000Z"),
      });
      done();
    });
  });

  it("get supervising by id", (done) => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    request(app)
      .get("/supervisings/d92da3ee-521c-4b93-9770-c38dcea173a5")
      .expect(200)
      .catch(done);

    subscribe("SUPERVISING_LOADED", (supervising) => {
      deepEqual(supervising, {
        id: "d92da3ee-521c-4b93-9770-c38dcea173a5",
        sessionId: "b605ad87-fe47-4dc8-b1cd-23d783c0a547",
        conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        question: "What time do you close?",
        answer: null,
        status: "IN_PROGRESS",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
        createdAt: new Date("2023-08-06T12:00:00.000Z"),
      });
      done();
    });
  });
});
