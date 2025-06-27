import * as test from "@nucleoidai/platform-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";

describe("Session service", () => {
  beforeEach(async () => test.reset());

  it("create a new session", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    const { body } = await request(app)
      .post("/sessions")
      .send({
        type: "CHAT",
        colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
      })
      .expect(200);

    deepEqual(body, {
      id: body.id,
      type: "CHAT",
      colleagueId: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
    });
  });

  it("add new conversation to an existing session", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .post("/sessions/b9901597-8625-43d9-a925-ed5e0ad7b1e4")
      .send({
        content: "Thank you for your answer",
      })
      .expect(200);

    const { body: session } = await request(app)
      .get("/sessions/b9901597-8625-43d9-a925-ed5e0ad7b1e4")
      .expect(200);

    deepEqual(session, [
      {
        id: "3b6625da-580e-4c4d-81da-f13476a62e67",
        role: "USER",
        content: "How do I make a great iced Americano ?",
        createdAt: "2023-08-05T12:00:10.000Z",
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
      {
        id: "bf78b75e-aa2c-4560-b9ab-4cf6644e2e30",
        role: "ASSISTANT",
        content:
          "To make a great iced Americano, follow these steps:\n" +
          "\n" +
          "1. Brew a double shot of espresso.\n" +
          "2. Fill a glass with ice cubes.\n" +
          "3. Pour the hot espresso over the ice.\n" +
          "4. Add cold water to taste, typically about equal to the amount of espresso.\n" +
          "5. Stir and enjoy!",
        createdAt: "2023-08-05T12:00:20.000Z",
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
      {
        id: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        role: "USER",
        content: "What time do you close?",
        createdAt: "2023-08-05T12:00:30.000Z",
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
      {
        id: body.id,
        role: "USER",
        content: "Thank you for your answer",
        createdAt: body.createdAt,
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
    ]);
  });

  it("get session by id", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .get("/sessions/b9901597-8625-43d9-a925-ed5e0ad7b1e4")
      .expect(200);

    deepEqual(body, [
      {
        id: "3b6625da-580e-4c4d-81da-f13476a62e67",
        role: "USER",
        content: "How do I make a great iced Americano ?",
        createdAt: "2023-08-05T12:00:10.000Z",
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
      {
        id: "bf78b75e-aa2c-4560-b9ab-4cf6644e2e30",
        role: "ASSISTANT",
        content:
          "To make a great iced Americano, follow these steps:\n" +
          "\n" +
          "1. Brew a double shot of espresso.\n" +
          "2. Fill a glass with ice cubes.\n" +
          "3. Pour the hot espresso over the ice.\n" +
          "4. Add cold water to taste, typically about equal to the amount of espresso.\n" +
          "5. Stir and enjoy!",
        createdAt: "2023-08-05T12:00:20.000Z",
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
      {
        id: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
        role: "USER",
        content: "What time do you close?",
        createdAt: "2023-08-05T12:00:30.000Z",
        sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
      },
    ]);
  });
});
