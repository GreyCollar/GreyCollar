import Communication from "../models/Communication";
import express from "express";
import platform from "@nucleoidai/platform-express";

const router = express.Router();

router.get("/", async (req, res) => {
  const comms = await Communication.findAll();

  res.status(200).json(comms);
});

router.get("/:id", async (req, res) => {
  const comm = await Communication.findByPk(req.params.id);

  res.status(200).json(comm);
});

router.post("/", async (req, res) => {
  try {
    const comm = await Communication.create(req.body);
    res.status(201).json(comm);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Communication.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Communication not found" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
