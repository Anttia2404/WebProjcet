import express from "express";
import passport from "passport";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  googleCallback,
  facebookCallback,
  getCurrentUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=google_auth_failed",
    session: false,
  }),
  googleCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5173/login?error=facebook_auth_failed",
    session: false,
  }),
  facebookCallback
);

router.get("/me", authMiddleware, getCurrentUser);

export default router;
