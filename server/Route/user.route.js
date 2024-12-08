import express from "express";

// Controllers
import { protect } from "../Controller/auth.controller.js";
import { getReferrals, updateProfile } from "../Controller/user.controller.js";

const router = express.Router();

router.get("/getReferrals", protect, getReferrals);

router.patch("/updateProfile", protect, updateProfile);

export default router;
