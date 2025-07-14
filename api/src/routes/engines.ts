import AIEngine from "../models/AIEngine";
import express from "express";
import platform from "@canmingir/link-express";

const router = express.Router();

router.get("/", async (req, res) => {
  const engines = await AIEngine.findAll();

  res.status(200).json(engines);
});

router.get("/:id", async (req, res) => {
  const engine = await AIEngine.findByPk(req.params.id);

  res.status(200).json(engine);
});

export default router;
