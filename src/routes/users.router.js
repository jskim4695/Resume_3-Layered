import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, checkPw, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "이메일은 필수값입니다." });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "비밀번호는 필수값입니다." });
    }

    if (!checkPw) {
      return res.status(400).json({ success: false, message: "비밀번호 확인은 필수값입니다." });
    }

    if (!name) {
      return res.status(400).json({ success: false, message: "이름은 필수값입니다." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "비밀번호는 최소 6자 이상입니다." });
    }

    if (password !== checkPw) {
      return res.status(400).json({ success: false, message: "비밀번호와 비밀번호 확인값이 일치하지 않습니다." });
    }

    const isExistUser = await prisma.users.findFirst({
      where: { email }
    });

    if (isExistUser) {
      return res.status(409).json({ message: "사용할 수 없는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return res.status(201).json({ email, name });
  } catch (err) {
    next(err);
  }
});

router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email }
  });

  if (!user) return res.status(401).json({ message: "존재하지 않는 이메일입니다." });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  const accessToken = jwt.sign({ userId: user.userId }, "custom-secret-key", { expiresIn: "12h" });

  return res.json({
    accessToken
  });
});

/** 사용자 조회 API **/
router.get("/users", authMiddleware, async (req, res, next) => {
  const user = res.locals.user;

  return res.json({
    email: user.email,
    name: user.name
  });
});

export default router;
