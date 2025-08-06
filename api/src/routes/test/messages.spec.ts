import * as test from "@canmingir/link-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";
import { subscribe } from "../../lib/Event";

describe("Messages service", () => {
  beforeEach(async () => test.reset());

  it("get messages", (done) => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    request(app).get("/messages").expect(200).catch(done);

    subscribe("MESSAGES_LOADED", (messages) => {
      deepEqual(messages, [
        {
          id: "ffd6dfa4-45ba-4da2-bc5c-5a529610b52f",
          role: "ASSISTANT",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          content: "Hi! I'm here to assist you with your coffee needs.",
          userId: null,
          command: null,
          knowledgeId: null,
          createdAt: "2023-08-05T12:00:00.000Z",
          status: "READ",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          replyTo: null,
        },
        {
          id: "eef6dfa4-45ba-4da2-bc5c-5a529610b52f",
          role: "USER",
          colleagueId: null,
          content: "How do I make a great iced Americano ?",
          userId: "1001",
          command: null,
          knowledgeId: null,
          status: "READ",
          createdAt: "2023-08-05T12:00:10.000Z",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          replyTo: null,
        },
        {
          id: "bbf6dfa4-45ba-4da2-bc5c-5a529610b52f",
          role: "ASSISTANT",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          createdAt: "2023-08-05T12:00:20.000Z",
          content:
            "To make a great iced Americano, follow these steps:\n\n1. Brew a double shot of espresso.\n2. Fill a glass with ice cubes.\n3. Pour the hot espresso over the ice.\n4. Add cold water to taste, typically about equal to the amount of espresso.\n5. Stir and enjoy!",
          userId: null,
          command: null,
          knowledgeId: null,
          status: "READ",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          replyTo: null,
        },
        {
          id: "ccf6dfa4-45ba-4da2-bc5c-5a529610b52f",
          role: "SYSTEM",
          colleagueId: null,
          content: null,
          userId: null,
          command: "/learn-text",
          knowledgeId: "9b1c0eb7-5ada-44e9-bd84-0f55943809b8",
          createdAt: "2023-08-05T12:00:30.000Z",
          status: "READ",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          replyTo: null,
        },

        {
          id: "e2256e48-3a97-4bed-941c-aa9266044935",
          role: "ASSISTANT",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          content:
            "The Philips 5400 LatteGo is a great choice for making iced Americano. You can prepare great Americanos by setting the coffee intensity to the 3rd degree. Here are a few additional tips specific to your machine:\n\n1. Use freshly ground coffee beans.\n2. Use filtered water.\n3. Pre-chill your glass.\n4. Adjust water for stronger flavor.\n5. Try adding a splash of syrup or milk.",
          userId: null,
          command: null,
          knowledgeId: null,
          createdAt: "2023-08-05T12:00:40.000Z",
          status: "READ",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          replyTo: null,
        },
        {
          id: "a5423326-9c64-4413-b6c7-5abbb3da6001",
          role: "USER",
          userId: "1001",
          content: "Thanks for the tips!",
          createdAt: "2023-08-05T12:00:45.000Z",
          status: "READ",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          colleagueId: null,
          command: null,
          knowledgeId: null,
          replyTo: "e2256e48-3a97-4bed-941c-aa9266044935",
        },
        {
          mode: "SUPERVISING",
          role: "SYSTEM",
          id: "0419a3c6-fa81-4963-921f-8e26a2531ab5",
          sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
          conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
          question: "What time do you close?",
          answer: "We are 7/24 coffee shop",
          status: "ANSWERED",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          createdAt: "2024-08-04T09:00:25.000Z",
        },
        {
          mode: "TASK",
          role: "SYSTEM",
          id: "8c88d077-99f1-482a-8575-879187b11ec9",
          description: "Find closing hours of Dark-sided Coffee Shop",
          comment: null,
          result: null,
          createdAt: "2025-01-19T10:34:20.094Z",
          status: "IN_PROGRESS",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
        },
        {
          type: "TEXT",
          mode: "KNOWLEDGE",
          role: "SYSTEM",
          id: "8bc99c86-59f2-48d6-ab3f-4e9129b53814",
          question: null,
          answer: null,
          url: null,
          content: null,
          taskId: null,
          text: "In-progress report on coffee service trends and improvements.",
          status: "COMPLETED",
          createdAt: "2024-08-07T10:00:00.000Z",
          ColleagueKnowledge: {
            id: "ea0bc7d4-8e0e-4118-9279-f9beaddd18f9",
            knowledgeId: "8bc99c86-59f2-48d6-ab3f-4e9129b53814",
            colleagueId: null,
            teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
            ProjectId: null,
            ColleagueKnowledgeId: null,
            ColleagueId: null,
            organizationId: null,
          },
        },
      ]);
      done();
    });
  });

  it("get messages by specific epoch createdAt", (done) => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    request(app)
      .get("/messages")
      .query({ offset: 1691236820000 })
      .expect(200)
      .catch(done);

    subscribe("MESSAGES_LOADED", (messages) => {
      deepEqual(messages, [
        {
          id: "ccf6dfa4-45ba-4da2-bc5c-5a529610b52f",
          role: "SYSTEM",
          colleagueId: null,
          content: null,
          userId: null,
          command: "/learn-text",
          status: "READ",
          knowledgeId: "9b1c0eb7-5ada-44e9-bd84-0f55943809b8",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          createdAt: "2023-08-05T12:00:30.000Z",
          replyTo: null,
        },
        {
          id: "e2256e48-3a97-4bed-941c-aa9266044935",
          role: "ASSISTANT",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          content:
            "The Philips 5400 LatteGo is a great choice for making iced Americano. You can prepare great Americanos by setting the coffee intensity to the 3rd degree. Here are a few additional tips specific to your machine:\n\n1. Use freshly ground coffee beans.\n2. Use filtered water.\n3. Pre-chill your glass.\n4. Adjust water for stronger flavor.\n5. Try adding a splash of syrup or milk.",
          userId: null,
          command: null,
          status: "READ",
          knowledgeId: null,
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          createdAt: "2023-08-05T12:00:40.000Z",
          replyTo: null,
        },
        {
          id: "a5423326-9c64-4413-b6c7-5abbb3da6001",
          role: "USER",
          colleagueId: null,
          content: "Thanks for the tips!",
          userId: "1001",
          command: null,
          status: "READ",
          knowledgeId: null,
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          createdAt: "2023-08-05T12:00:45.000Z",
          replyTo: "e2256e48-3a97-4bed-941c-aa9266044935",
        },
        {
          mode: "SUPERVISING",
          role: "SYSTEM",
          id: "0419a3c6-fa81-4963-921f-8e26a2531ab5",
          sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
          conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
          question: "What time do you close?",
          answer: "We are 7/24 coffee shop",
          status: "ANSWERED",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          createdAt: "2024-08-04T09:00:25.000Z",
        },
        {
          mode: "TASK",
          role: "SYSTEM",
          id: "8c88d077-99f1-482a-8575-879187b11ec9",
          description: "Find closing hours of Dark-sided Coffee Shop",
          comment: null,
          result: null,
          createdAt: "2025-01-19T10:34:20.094Z",
          status: "IN_PROGRESS",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
        },
        {
          type: "TEXT",
          mode: "KNOWLEDGE",
          role: "SYSTEM",
          id: "8bc99c86-59f2-48d6-ab3f-4e9129b53814",
          question: null,
          answer: null,
          url: null,
          content: null,
          taskId: null,
          text: "In-progress report on coffee service trends and improvements.",
          status: "COMPLETED",
          createdAt: "2024-08-07T10:00:00.000Z",
          ColleagueKnowledge: {
            id: "ea0bc7d4-8e0e-4118-9279-f9beaddd18f9",
            knowledgeId: "8bc99c86-59f2-48d6-ab3f-4e9129b53814",
            colleagueId: null,
            teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
            ProjectId: null,
            ColleagueKnowledgeId: null,
            ColleagueId: null,
            organizationId: null,
          },
        },
      ]);
      done();
    });
  });

  it("get messages by specific regular createdAt ", (done) => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    request(app)
      .get("/messages")
      .query({ offset: "2023-08-05T12:00:20.000Z" })
      .expect(200)
      .catch(done);

    subscribe("MESSAGES_LOADED", (messages) => {
      deepEqual(messages, [
        {
          id: "ccf6dfa4-45ba-4da2-bc5c-5a529610b52f",
          role: "SYSTEM",
          colleagueId: null,
          content: null,
          userId: null,
          command: "/learn-text",
          status: "READ",
          knowledgeId: "9b1c0eb7-5ada-44e9-bd84-0f55943809b8",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          createdAt: "2023-08-05T12:00:30.000Z",
          replyTo: null,
        },
        {
          id: "e2256e48-3a97-4bed-941c-aa9266044935",
          role: "ASSISTANT",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          content:
            "The Philips 5400 LatteGo is a great choice for making iced Americano. You can prepare great Americanos by setting the coffee intensity to the 3rd degree. Here are a few additional tips specific to your machine:\n\n1. Use freshly ground coffee beans.\n2. Use filtered water.\n3. Pre-chill your glass.\n4. Adjust water for stronger flavor.\n5. Try adding a splash of syrup or milk.",
          userId: null,
          command: null,
          status: "READ",
          knowledgeId: null,
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          createdAt: "2023-08-05T12:00:40.000Z",
          replyTo: null,
        },
        {
          id: "a5423326-9c64-4413-b6c7-5abbb3da6001",
          role: "USER",
          colleagueId: null,
          content: "Thanks for the tips!",
          userId: "1001",
          command: null,
          status: "READ",
          knowledgeId: null,
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          createdAt: "2023-08-05T12:00:45.000Z",
          replyTo: "e2256e48-3a97-4bed-941c-aa9266044935",
        },
        {
          mode: "SUPERVISING",
          role: "SYSTEM",
          id: "0419a3c6-fa81-4963-921f-8e26a2531ab5",
          sessionId: "b9901597-8625-43d9-a925-ed5e0ad7b1e4",
          conversationId: "93dcd933-9bd8-45c0-b347-2dc12a0b2658",
          question: "What time do you close?",
          answer: "We are 7/24 coffee shop",
          status: "ANSWERED",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          createdAt: "2024-08-04T09:00:25.000Z",
        },
        {
          mode: "TASK",
          role: "SYSTEM",
          id: "8c88d077-99f1-482a-8575-879187b11ec9",
          description: "Find closing hours of Dark-sided Coffee Shop",
          comment: null,
          result: null,
          createdAt: "2025-01-19T10:34:20.094Z",
          status: "IN_PROGRESS",
          colleagueId: "00db1bd4-4829-40f2-8b99-d2e42342157e",
        },
        {
          type: "TEXT",
          mode: "KNOWLEDGE",
          role: "SYSTEM",
          id: "8bc99c86-59f2-48d6-ab3f-4e9129b53814",
          question: null,
          answer: null,
          url: null,
          content: null,
          taskId: null,
          text: "In-progress report on coffee service trends and improvements.",
          status: "COMPLETED",
          createdAt: "2024-08-07T10:00:00.000Z",
          ColleagueKnowledge: {
            id: "ea0bc7d4-8e0e-4118-9279-f9beaddd18f9",
            knowledgeId: "8bc99c86-59f2-48d6-ab3f-4e9129b53814",
            colleagueId: null,
            teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
            ProjectId: null,
            ColleagueKnowledgeId: null,
            ColleagueId: null,
            organizationId: null,
          },
        },
      ]);
      done();
    });
  });

  it("update messages status from a specific createdAt", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    await request(app)
      .patch("/messages")
      .send({ status: "READ" })
      .query({ offset: 1691239800000 })
      .expect(200);
  });

  it("send new message", (done) => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    request(app)
      .post("/messages")
      .send({
        role: "USER",
        content: "Hello",
        userId: "1001",
      })
      .expect(200)
      .catch(done);

    subscribe("MESSAGE", "USER_MESSAGED", (message) => {
      deepEqual(message, {
        id: message.id,
        role: "USER",
        content: "Hello",
        userId: "1001",
        createdAt: message.createdAt,
        status: "READ",
        teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
        knowledgeId: null,
        colleagueId: null,
        command: null,
        replyTo: null,
      });
      done();
    });

    subscribe("MESSAGE", "ASSISTANT_MESSAGED", (message) => {
      deepEqual(message, {
        id: message.id,
        createdAt: message.createdAt,
        role: "ASSISTANT",
        colleagueId: undefined,
        content: "Hi there! How can I assist you today?",
        userId: undefined,
        command: undefined,
        knowledgeId: undefined,
        teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
        replyTo: undefined,
        status: null,
      });
      done();
    });
  });
});
