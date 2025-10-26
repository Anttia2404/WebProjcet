import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

console.log(
  "KIỂU DỮ LIỆU CỦA PORT:",
  typeof process.env.DB_PORT,
  "Giá trị:",
  process.env.DB_PORT
);

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default {
  query: (text, params) => pool.query(text, params),
};
