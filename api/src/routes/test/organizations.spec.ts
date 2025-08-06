import * as test from "@canmingir/link-express/test";

import app from "../../app";
import { deepEqual } from "assert";
import request from "supertest";

describe("Organization Colleagues", () => {
  beforeEach(async () => test.reset());

  it("lists organization with colleagues and teams", async () => {
    test.project("e6d4744d-a11b-4c75-acad-e24a02903729");

    const { body } = await request(app)
      .get("/organizations/1c063446-7e78-432a-a273-34f481d0f0c3")
      .expect(200);

    deepEqual(body, [
      {
        id: "e6d4744d-a11b-4c75-acad-e24a02903729",
        name: "Good Galactic Customer Service Team",
        icon: ":fa6-brands:galactic-republic:",
        description: null,
        type: null,
        organizationId: "1c063446-7e78-432a-a273-34f481d0f0c3",
        coach: "Emily",
        colleagues: [
          {
            id: "72ef5b08-b4a9-42b7-bb0a-22d40e56798b",
            name: "Alex",
            title: "Account Expert",
            avatar: ":5:",
            character: "Professional, friendly, and a problem solver",
            role: "Specializes in financial management and strategy.",
            teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
            aiEngineId: "d9c93323-3baf-4623-a96c-b85db99b4441",
          },
          {
            id: "ef906c5d-cafe-4518-9edc-b80c605df58e",
            name: "Taylor",
            title: "Customer Service Representative",
            avatar: ":2:",
            character: "Friendly, helpful, and a team player",
            role: "Customer Service Representative",
            teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
            aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
          },
        ],
      },
      {
        id: "0c756054-2d28-4f87-9b12-8023a79136a5",
        name: "Good Galactic Corp.",
        icon: ":fa6-brands:galactic-republic:",
        description:
          "The most trusted Galacticing institution in the Core Worlds, with secure vaults that would impress even the Empire.",
        type: "MULTI",
        organizationId: "1c063446-7e78-432a-a273-34f481d0f0c3",
        coach: null,
        colleagues: [],
      },
      {
        id: "488edd32-93cd-491f-a108-f872e39517cc",
        name: "Good Galactic Team",
        icon: ":fa6-brands:galactic-republic:",
        description: null,
        type: null,
        organizationId: "1c063446-7e78-432a-a273-34f481d0f0c3",
        coach: "Elijah",
        colleagues: [
          {
            id: "7a222222-9696-498f-9aaf-b4cf5b2ca043",
            name: "Ava",
            title: "Barista",
            avatar: ":1:",
            character: "Funny, friendly, and a coffee lover",
            role: "Barista Expert",
            teamId: "488edd32-93cd-491f-a108-f872e39517cc",
            aiEngineId: "123a3c9a-b23b-421a-ac6e-f14052a2d57c",
          },
        ],
      },
    ]);
  });
});
