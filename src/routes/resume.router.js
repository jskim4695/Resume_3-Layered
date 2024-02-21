import express from "express";
import { ResumeController } from "../controllers/resume.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
const resumeController = new ResumeController();

router.post("/resume", authMiddleware, resumeController.createResume);
router.get("/resumes", resumeController.getResumes);
router.get("/resume/:resumeId", resumeController.getResumeById);
router.patch(
  "/resume/:resumeId",
  authMiddleware,
  resumeController.updateResume
);
router.delete(
  "/resume/:resumeId",
  authMiddleware,
  resumeController.deleteResume
);

// /** 이력서 생성 API **/
// router.post("/resume", authMiddleware, async (req, res, next) => {
//   const user = res.locals.user;
//   const { title, content } = req.body;

//   const resume = await prisma.resume.create({
//     data: {
//       userId: user.userId,
//       title,
//       content,
//     },
//   });

//   return res.end();
// });

// /** 이력서 목록 조회 API **/
// router.get("/resumes", async (req, res, next) => {
//   const orderKey = req.query.orderKey ?? "resumeId";
//   const orderValue = req.query.orderValue ?? "desc";

//   if (!["resumeId", "status"].includes(orderKey)) {
//     return res.status(400).json({
//       success: false,
//       message: "orderKey가 올바르지 않습니다.",
//     });
//   }

//   if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
//     return res.status(400).json({
//       success: false,
//       message: "orderKey가 올바르지 않습니다.",
//     });
//   }

//   const resume = await prisma.resume.findMany({
//     select: {
//       resumeId: true,
//       userId: true,
//       title: true,
//       content: true,
//       // author: true,
//       user: {
//         select: {
//           name: true,
//         },
//       },
//       status: true,
//       createdAt: true,
//       //   updatedAt: true,
//     },
//     orderBy: [
//       {
//         [orderKey]: orderValue.toLowerCase(), // 대괄호로 감싸주면 이름 그대로 들어가는 것이 아니라 변수를 통해서 들어감.
//       },
//     ],
//   });
//   resume.forEach((re) => {
//     re.name = re.user.name;
//     delete re.name;
//   });

//   return res.status(200).json({ data: resume });
// });

// // ** 이력서 상세 조회 API **/
// router.get("/resume/:resumeId", async (req, res, next) => {
//   const { resumeId } = req.params;
//   const resume = await prisma.resume.findFirst({
//     where: {
//       resumeId: +resumeId,
//     },
//     select: {
//       resumeId: true,
//       title: true,
//       content: true,
//       status: true,
//       user: {
//         select: {
//           name: true,
//         },
//       },
//       createdAt: true,
//     },
//   });

//   return res.status(200).json({ data: resume });
// });

// // //** 이력서 수정 API **/
// router.patch("/resume/:resumeId", authMiddleware, async (req, res, next) => {
//   const user = res.locals.user;
//   const { title, content, status } = req.body;
//   const resumeId = req.params.resumeId;

//   if (!resumeId) {
//     return res.status(400).json({
//       success: false,
//       message: "resumeId는 필수값입니다.",
//     });
//   }

//   if (!title) {
//     return res.status(400).json({
//       success: false,
//       message: "제목은 필수값입니다.",
//     });
//   }

//   if (!content) {
//     return res.status(400).json({
//       success: false,
//       message: "자기소개는 필수값입니다.",
//     });
//   }

//   if (!status) {
//     return res.status(400).json({
//       success: false,
//       message: "상태값은 필수값입니다.",
//     });
//   }

//   // 이력서 조회
//   const resume = await prisma.resume.findFirst({
//     where: {
//       resumeId: Number(resumeId),
//     },
//   });

//   if (!resume) {
//     return res.status(400).json({
//       success: false,
//       message: "존재하지 않는 이력서입니다.",
//     });
//   }

//   if (resume.userId !== user.userId) {
//     return res.status(400).json({
//       success: false,
//       message: "잘못된 접근입니다.",
//     });
//   }

//   // 유효한 enum 값인지 확인
//   const statusValues = [
//     "APPLY",
//     "DROP",
//     "PASS",
//     "INTERVIEW1",
//     "INTERVIEW2",
//     "FINAL_PASS",
//   ];
//   if (!statusValues.includes(status)) {
//     return res
//       .status(400)
//       .json({ message: "유효하지 않은 이력서 상태 값입니다." });
//   }

//   // 내가 작성한 이력서이다.
//   await prisma.resume.update({
//     where: { resumeId: +resumeId },
//     data: { title, content, status },
//   });

//   res.status(201).end();
// });

// // //** 이력서 삭제 API **/
// router.delete("/resume/:resumeId", authMiddleware, async (req, res, next) => {
//   const user = res.locals.user;
//   const resumeId = req.params.resumeId;

//   try {
//     const resume = await prisma.resume.findFirst({
//       where: {
//         resumeId: Number(resumeId),
//       },
//     });

//     if (!resume) {
//       return res.status(400).json({
//         success: false,
//         message: "존재하지 않는 이력서입니다.",
//       });
//     }

//     if (resume.userId !== user.userId) {
//       return res.status(400).json({
//         success: false,
//         message: "잘못된 접근입니다.",
//       });
//     }

//     await prisma.resume.delete({
//       where: { resumeId: +resumeId },
//     });

//     res.status(201).json({ message: "이력서를 삭제하였습니다." });
//   } catch (error) {
//     res.status(500).json({ message: "이력서 삭제에 실패했습니다." });
//   }
// });

export default router;
