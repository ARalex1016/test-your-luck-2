import express from "express";

// Controller
import { protect, authorize } from "../Controller/auth.controller.js";
import {
  getAllContests,
  getContest,
  getParticipatedContest,
  createContest,
  updateContest,
  deleteContest,
  participateContest,
  exchangeCoins,
} from "../Controller/contest.controller.js";

// Middleware
import { contestParam } from "../Middleware/param.middleware.js";

const router = express.Router();

router.param("contestId", contestParam);

// All Contest Routes
router.get("/", getAllContests);
router.get("/participated", protect, getParticipatedContest);
router.get("/:contestId", getContest);

router.post("/", protect, authorize("admin", "manager"), createContest);

router.patch(
  "/:contestId",
  protect,
  authorize("admin", "manager"),
  updateContest
);
router.delete(
  "/:contestId",
  protect,
  authorize("admin", "manager"),
  deleteContest
);

router.post("/:contestId/participate", protect, participateContest);

router.post("/:contestId/exchange-coin", protect, exchangeCoins);

export default router;
