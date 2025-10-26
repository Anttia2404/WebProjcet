import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui long nhap email va password" });
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = createUser(email, hashedPassword, fullName);
    res.status(201).json({
      message: "Tao tai khoan thanh cong",
      user: newUser,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email nay da duoc dang ky" });
    }
    console.error("Loi controller dang ky: ", err);
    res.status(500).json({ message: "Loi Server" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui long nhap email va password" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoac mat khau khong dung" });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoac mat khau khong dung" });
    }
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Dang nhap thanh cong!",
      token: token,
    });
  } catch (err) {
    console.error("Loi controller dang nhap", err);
    res.status(500).json({ message: "Loi server" });
  }
};

export const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Xac thuc Google that bai.");
    }
    const payload = {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.full_name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  } catch (err) {
    console.error("Loi Google Callback:", err);
    res.redirect("http://localhost:5173/login?error=google_auth_failed");
  }
};

export const facebookCallback = (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Xac thuc Facebook that bai.");
    }
    const payload = {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.full_name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  } catch (err) {
    console.error("Loi Facebook Callback:", err);
    res.redirect("http://localhost:5173/login?error=facebook_auth_failed");
  }
};
