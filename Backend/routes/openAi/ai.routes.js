// routes/ai/ai.routes.js
import express from "express";
import { validateBloom } from "../../controllers/openAi/ai.controller.js";
// import { validateBloom } from "../../controllers/ai/bloom.controller.js";
// Optional: add auth or body validation middleware here

const router = express.Router();
router.post("/validate-bloom", validateBloom);

export default router;
