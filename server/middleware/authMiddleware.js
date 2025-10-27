import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Khong tim thay token" });
    }
    const token = authHeader.split(" ")[1];
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload;
    next();
  } catch (err) {
    console.error("Loi xac thuc token", err.message);
    return res.status(401).json({ message: "Token khong hop le hoac het han" });
  }
};

export default authMiddleware;
