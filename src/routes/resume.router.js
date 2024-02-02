import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 이력서 생성 API **/
router.post("/resume", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { title, content } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      userId: +userId
    }
  });

  const author = user.name;

  const resume = await prisma.resume.create({
    data: {
      userId: +userId,
      title,
      author,
      content
    }
  });

  return res.status(201).json({ data: resume });
});

/** 이력서 목록 조회 API **/
router.get("/resumes", async (req, res, next) => {
  const resume = await prisma.resume.findMany({
    select: {
      resumeId: true,
      userId: true,
      title: true,
      content: true,
      author: true,
      status: true,
      createdAt: true
      //   updatedAt: true,
    }
  });

  return res.status(200).json({ data: resume });
});

// ** 이력서 상세 조회 API **/
router.get("/resume/:resumeId", async (req, res, next) => {
  const { resumeId } = req.params;
  const resume = await prisma.resume.findFirst({
    where: {
      resumeId: +resumeId
    },
    select: {
      resumeId: true,
      userId: true,
      title: true,
      content: true,
      author: true,
      status: true,
      createdAt: true
      //   updatedAt: true,
    }
  });

  return res.status(200).json({ data: resume });
});

// //** 이력서 수정 API **/
router.patch("/resume/:resumeId", authMiddleware, async (req, res, next) => {
  const { resumeId } = req.params;
  const { title, content, status } = req.body;
  const userId = req.user.userId;

  try {
    // 이력서 조회
    const resume = await prisma.resume.findUnique({
      where: { resumeId: +resumeId }
    });

    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
    }

    if (resume.userId !== userId) {
      return res.status(403).json({ message: "이력서 수정 권한이 없습니다." });
    }

    // 유효한 enum 값인지 확인
    const statusValues = ["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"];
    if (!statusValues.includes(status)) {
      return res.status(400).json({ message: "유효하지 않은 이력서 상태 값입니다." });
    }

    const updatedResume = await prisma.resume.update({
      where: { resumeId: +resumeId },
      data: { title, content, status }
    });

    res.status(201).json({ message: "이력서 수정에 성공하였습니다." });
  } catch (error) {
    res.status(500).json({ message: "이력서 수정에 실패했습니다." });
  }
});

// //** 이력서 삭제 API **/
router.delete("/resume/:resumeId", authMiddleware, async (req, res, next) => {
  const { resumeId } = req.params;
  const userId = req.user.userId;

  try {
    // 이력서 조회
    const resume = await prisma.resume.findUnique({
      where: { resumeId: +resumeId }
    });

    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
    }

    if (resume.userId !== userId) {
      return res.status(403).json({ message: "이력서 삭제 권한이 없습니다." });
    }

    await prisma.resume.delete({
      where: { resumeId: +resumeId }
    });

    res.status(201).json({ message: "이력서를 삭제하였습니다." });
  } catch (error) {
    res.status(500).json({ message: "이력서 삭제에 실패했습니다." });
  }
});

export default router;
