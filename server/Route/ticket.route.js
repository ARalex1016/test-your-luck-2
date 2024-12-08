import express from "express";

// Middleware
import { contestParam, ticketParam } from "../Middleware/param.middleware.js";

// Controllers
import { getTicketById } from "../Controller/contest.controller.js";

const router = express.Router();

router.param("ticketId", ticketParam);

router.get("/:ticketId", getTicketById);

export default router;
