import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import UsersRouter from "./src/routes/users.router.js";
import ResumeRouter from "./src/routes/resume.router.js";
import AuthRouter from "./src/routes/auth.router.js";

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, ResumeRouter, AuthRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
