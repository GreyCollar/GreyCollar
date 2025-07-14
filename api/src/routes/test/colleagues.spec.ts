import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";
import test from "@canmingir/link-express/test";

describe("Colleague service", () => {
  beforeEach(async () => test.reset());

  it("creates a colleague", async () => {
    const { body } = await request(app)
      .post("/colleagues")
      .send({
        name: "Test Colleague",
        avatar: "Test Avatar",
        character: "Test Character",
        title: "Test Title",
        role: "Test Role",
        teamId: "cb16e069-6214-47f1-9922-1f7fe7629525",
        aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
      })
      .expect(201);

    deepEqual(body, {
      id: body.id,
      name: "Test Colleague",
      avatar: "Test Avatar",
      character: "Test Character",
      role: "Test Role",
      title: "Test Title",
      teamId: "cb16e069-6214-47f1-9922-1f7fe7629525",
      aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
    });
  });

  it("lists colleagues", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    const { body } = await request(app).get("/colleagues").expect(200);

    deepEqual(body, [
      {
        id: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
        name: "Alex",
        avatar: ":5:",
        character: "Professional, friendly, and a problem solver",
        title: "Account Expert",
        role: "Specializes in financial management and strategy.",
        teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        AIEngine: {
          id: "d9c93323-3baf-4623-a96c-b85db99b4441",
          vendor: "Claude",
          avatar: ":2:",
          model: "Sonnet 3.5",
          createdAt: "2024-07-01T00:00:00.000Z",
          description:
            "Claude 3.5 Sonnet is Anthropic's advanced AI model, offering a balanced combination of intelligence and efficiency.",
          price: 1.5,
        },
      },
      {
        id: "ef906c5d-cafe-4518-9edc-b80c605df58e",
        name: "Taylor",
        avatar: ":2:",
        character: "Friendly, helpful, and a team player",
        title: "Customer Service Representative",
        role: "Customer Service Representative",
        teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
        AIEngine: {
          id: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
          vendor: "OpenAI",
          avatar: ":1:",
          description:
            "GPT-4 Optimized (4o) is OpenAI's advanced large language model, featuring enhanced performance and efficiency compared to standard GPT-4.",
          price: 1.2,
          model: "4o",
          createdAt: "2024-06-01T00:00:00.000Z",
        },
      },
    ]);
  });

  it("retrieves colleague by id", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .get(`/colleagues/00db1bd4-4829-40f2-8b99-d2e42342157e`)
      .expect(200);

    deepEqual(body, {
      id: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      name: "Ava",
      title: "Barista",
      avatar: ":1:",
      character: "Funny, friendly, and a coffee lover",
      role: "Barista Expert",
      teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
      AIEngine: {
        createdAt: "2024-06-01T00:00:00.000Z",
        id: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
        description:
          "GPT-4 Optimized (4o) is OpenAI's advanced large language model, featuring enhanced performance and efficiency compared to standard GPT-4.",
        price: 1.2,
        avatar: ":1:",
        model: "4o",
        vendor: "OpenAI",
      },
    });
  });

  it("updates colleague", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .put(`/colleagues/00db1bd4-4829-40f2-8b99-d2e42342157e`)
      .send({
        name: "Updated Name",
        title: "Barista",
        avatar: "/avatars/updated.avatar.png",
        character: "Updated Character",
        role: "Updated Role",
        teamId: "cb16e069-6214-47f1-9922-1f7fe7629525",
        aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
      })
      .expect(200);

    deepEqual(body, {
      id: "00db1bd4-4829-40f2-8b99-d2e42342157e",
      name: "Updated Name",
      title: "Barista",
      avatar: "/avatars/updated.avatar.png",
      character: "Updated Character",
      role: "Updated Role",
      teamId: "cb16e069-6214-47f1-9922-1f7fe7629525",
      aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
    });
  });

  it("deletes colleague", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    await request(app)
      .delete(`/colleagues/00db1bd4-4829-40f2-8b99-d2e42342157e`)
      .expect(204);
  });
});
