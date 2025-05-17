import communication from "../functions/communication";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const comms = await communication.read();
  res.status(200).json(comms);
});

router.get("/:id", async (req, res) => {
  const comm = await communication.get({ communicationId: req.params.id });
  res.status(200).json(comm);
});

router.post("/", async (req, res) => {
  const { ...data } = req.body;
  const comm = await communication.create({
    data,
  });
  res.status(201).json(comm);
});

router.delete("/:id", async (req, res) => {
  await communication.remove({ communicationId: req.params.id });
  res.sendStatus(204);
});

export default router;
