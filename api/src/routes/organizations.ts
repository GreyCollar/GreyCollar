import Colleague from "../models/Colleague";
import { Project } from "@canmingir/link-express/models";
import express from "express";
import platform from "@canmingir/link-express";
const router = express.Router();

router.get("/:id", async (req, res) => {
  const { organizationId } = req.session;
  const { id } = req.params;

  if (organizationId !== id) {
    return res.status(401).end();
  }

  const colleagues = await Project.findAll({
    where: { organizationId: id },
    include: [
      {
        model: Colleague,
        as: "colleagues",
      },
    ],
  });

  if (!colleagues) {
    return res.status(404);
  }

  res.json(colleagues);
});

export default router;
