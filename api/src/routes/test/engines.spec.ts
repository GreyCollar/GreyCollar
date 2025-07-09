import * as test from "@nucleoidai/platform-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";

describe("Engines service", () => {
  beforeEach(async () => test.reset());

  it("get engines", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");
    const { body } = await request(app).get("/engines").expect(200);

    deepEqual(body, [
      {
        id: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
        avatar: ":1:",
        vendor: "OpenAI",
        model: "4o",
        description:
          "GPT-4 Optimized (4o) is OpenAI's advanced large language model, featuring enhanced performance and efficiency compared to standard GPT-4.",
        price: 1.2,
        createdAt: "2024-06-01T00:00:00.000Z",
      },
      {
        id: "d9c93323-3baf-4623-a96c-b85db99b4441",
        vendor: "Claude",
        avatar: ":2:",
        model: "Sonnet 3.5",
        description:
          "Claude 3.5 Sonnet is Anthropic's advanced AI model, offering a balanced combination of intelligence and efficiency.",
        price: 1.5,
        createdAt: "2024-07-01T00:00:00.000Z",
      },
      {
        id: "123a3c9a-b23b-421a-ac6e-f14052a2d57c",
        vendor: "DeepMind",
        avatar: ":3:",
        model: "Sparrow Pro",
        description:
          "Sparrow Pro by DeepMind is an advanced conversational AI with built-in ethical safeguards.",
        price: 1.2,
        createdAt: "2024-07-15T00:00:00.000Z",
      },
      {
        id: "a651c60b-19ad-410b-8ce2-6299e58a53d8",
        vendor: "IBM Watson",
        avatar: ":2:",
        model: "Discovery 2.0",
        description:
          "Watson Discovery 2.0 by IBM provides intelligent search and content analysis capabilities.",
        price: 1.6,
        createdAt: "2024-08-01T00:00:00.000Z",
      },
      {
        id: "456b3c9a-f56b-421a-ac6e-a14052a2f33d",
        vendor: "Google Bard",
        avatar: ":3:",
        model: "BardX",
        description:
          "BardX is Google’s latest AI for creative and conversational applications.",
        price: 1.1,
        createdAt: "2023-12-01T00:00:00.000Z",
      },
      {
        id: "5ac93323-8aaf-4623-a96c-c77cb88b9992",
        vendor: "Meta",
        avatar: ":1:",
        model: "Llama 3",
        description:
          "Llama 3 by Meta is a powerful large language model optimized for scalability and precision.",
        price: 0.9,
        createdAt: "2024-01-20T00:00:00.000Z",
      },
    ]);
  });

  it("get engine by id", async () => {
    test.project("add6dfa4-45ba-4da2-bc5c-5a529610b52f");

    const { body } = await request(app)
      .get("/engines/289a3c9a-f23b-421a-ac6e-f14052a2d57c")
      .expect(200);

    deepEqual(body, {
      id: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
      vendor: "OpenAI",
      avatar: ":1:",
      description:
        "GPT-4 Optimized (4o) is OpenAI's advanced large language model, featuring enhanced performance and efficiency compared to standard GPT-4.",
      price: 1.2,
      model: "4o",
      createdAt: "2024-06-01T00:00:00.000Z",
    });
  });
});
