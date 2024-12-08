import express from "express";

// Controllers
import {
  signup,
  login,
  logout,
  protect,
  checkAuth,
} from "./../Controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/check-auth", protect, checkAuth);

export default router;
