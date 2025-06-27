import * as test from "@nucleoidai/platform-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";

describe("Team service", () => {
  beforeEach(async () => test.reset());

  it("get team details by id", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    const { body } = await request(app).get("/teams/details").expect(200);

    deepEqual(body, {
      id: "e6d4744d-a11b-4c75-acad-e24a02903729",
      coach: "Emily",
      coachAvatar: ":6:",
    });
  });

  it("update team details", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    await request(app)
      .patch("/teams/details")
      .send({
        coach: "John",
        coachAvatar: ":7:",
      })
      .expect(200);

    const { body } = await request(app).get("/teams/details").expect(200);

    deepEqual(body, {
      id: "e6d4744d-a11b-4c75-acad-e24a02903729",
      coach: "John",
      coachAvatar: ":7:",
    });
  });
});
