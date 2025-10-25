import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from "../models/user.model.js"

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Vui long nhap email va password" });
        }
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser= createUser(email, hashedPassword);
        res.status(201).json({
            message: "Tao tai khoan thanh cong",
            user: newUser
        })
    } catch(err) {
        if (err.code === '23505') {
            return res.status(409).json({message: "Email nay da duoc dang ky"})
        }
        console.error("Loi controller dang ky: ", err);
        res.status(500).json({message: "Loi Server"})
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Vui long nhap email va password" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Email hoac mat khau khong dung" });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Email hoac mat khau khong dung" });
        }
        const payload = {
            id: user.id,
            email: user.email
        };
        
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            message: "Dang nhap thanh cong!",
            token: token
        });

    } catch (err) {
        console.error("Loi controller dang nhap", err);
        res.status(500).json({ message: "Loi server" });
    }
};