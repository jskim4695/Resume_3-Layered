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

    const isExistUser = await prisma.users.findFirst({
      where: { email }
    });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    if (password !== checkPw) {
      return res.status(400).json({ message: "비밀번호 확인이 일치하지 않습니다." });
    }

    if (password.length < 6) {
      return res.status(401).json({ message: "비밀번호는 최소 6글자 이상이어야 합니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        checkPw: hashedPassword,
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

  const token = jwt.sign({ userId: user.userId }, "custom-secret-key", { expiresIn: "12h" });

  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인에 성공하였습니다." });
});

/** 사용자 조회 API **/
router.get("/users", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      name: true,
      createdAt: true
    }
  });

  return res.status(200).json({ data: user });
});

export default router;
