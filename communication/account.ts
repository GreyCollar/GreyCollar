import connects from "./connects.json";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import storage from "./Storage";

dotenv.config();

function account(slackUserId) {
  const githubUserId = connects[slackUserId];
  const teamId = storage.get("selectedTeamId");
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  const accessToken = jwt.sign(
    {
      sub: githubUserId,
      iss: "nuc",
      aid: "10b7bc8c-a49c-4002-b0ec-63599e4b5210",
      ...(teamId && { aud: teamId }),
    },
    jwtSecret,
    {
      expiresIn: "1m",
    }
  );

  return {
    githubUserId,
    slackUserId,
    accessToken,
  };
}

export { account };
