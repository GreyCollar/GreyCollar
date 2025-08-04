import express from "express";
import os from "os";
import platform from "@canmingir/link-express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    free: os.freemem(),
    total: os.totalmem(),
  });
});

export default router;
