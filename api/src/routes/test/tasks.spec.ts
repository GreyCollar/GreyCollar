import * as test from "@nucleoidai/platform-express/test";
import { subscribe } from "../../lib/Event";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";

describe("Tasks service", () => {
  beforeEach(async () => test.reset());

  it("creates a task", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .post("/tasks")
      .send({
        description: "Find closing hours of Dark-sided Coffee Shop",
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      })
      .expect(200);

    subscribe("TASK_CREATED", (task) => {
      deepEqual(task, {
        id: body.id,
        description: "Find closing hours of Dark-sided Coffee Shop",
        status: "IN_PROGRESS",
        createdAt: body.createdAt,
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      });
    });
  });

  it("gets task", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .get("/tasks?colleagueId=00db1bd4-4829-40f2-8b99-d2e42342157e")
      .expect(200);

    deepEqual(body, [
      {
        id: "8c88d077-99f1-482a-8575-879187b11ec9",
        description: "Find closing hours of Dark-sided Coffee Shop",
        status: "IN_PROGRESS",
        comment: null,
        result: null,
        createdAt: "2025-01-19T10:34:20.094Z",
        colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      },
    ]);
  });

  it("gets task by id", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .get("/tasks/8c88d077-99f1-482a-8575-879187b11ec9")
      .expect(200);

    deepEqual(body, {
      id: "8c88d077-99f1-482a-8575-879187b11ec9",
      description: "Find closing hours of Dark-sided Coffee Shop",
      status: "IN_PROGRESS",
      comment: null,
      result: null,
      createdAt: "2025-01-19T10:34:20.094Z",
      colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      Colleague: {
        teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
      },
    });
  });
});
