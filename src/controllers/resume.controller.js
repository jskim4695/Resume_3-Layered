import { jwt } from "jsonwebtoken";
import { resumeService } from "../services/resume.service";

export class ResumeController {
  // 이력서 조회 api
  getResumes = async (req, res, next) => {
    const orderKey = req.query.orderKey ?? "resumeId";
    const orderValue = req.query.orderValue ?? "desc";

    if (!["resumeId", "status"].includes(orderKey)) {
      return res.status(400).json({
        success: false,
        message: "orderKey 가 올바르지 않습니다.",
      });
    }

    if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "orderValue 가 올바르지 않습니다.",
      });
    }

    resumes = await resumeService.findAllSortedResumes({
      orderKey,
      orderValue: orderValue.toLowerCase(),
    });

    return res.json({ data: resumes });
  };

  // 이력서 상세 조회
  getResumeById = async (req, res, next) => {
    const resumeId = req.params.resumeId;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId는 필수값입니다.",
      });
    }

    const resume = await resumeService.findResumeById(resumeId);

    if (!resume) {
      return res.json({ data: {} });
    }

    return res.json({ data: resume });
  };

  // 이력서 생성
  createResume = async (req, res, next) => {
    const userId = res.locals.user;
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "이력서 제목은 필수값 입니다",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "자기소개는 필수값 입니다",
      });
    }

    await resumeService.createResume({
      title,
      content,
      userId,
    });

    return res.status(201).end();
  };

  // 이력서 수정
  updateResume = async (req, res, next) => {
    const user = res.locals.user;
    const resumeId = req.params.resumeId;
    const { title, content, status } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId 는 필수값입니다",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "이력서 제목은 필수값입니다",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "자기소개는 필수값입니다",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "상태값은 필수값입니다",
      });
    }

    // status 는 존재
    if (
      ![
        "APPLY",
        "DROP",
        "PASS",
        "INTERVIEW1",
        "INTERVIEW2",
        "FINAL_PASS",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "올바르지 않은 상태값 입니다.",
      });
    }

    await resumeService.updateResumeByResumeId(
      resumeId,
      {
        title,
        content,
        status,
      },
      user
    );

    // 이력서 삭제 api
    deleteResume = async (req, res, next) => {
      const user = res.locals.user;
      const resumeId = req.params.resumeId;

      if (!resumeId) {
        return res.status(400).json({
          success: false,
          message: "resumeId 는 필수값입니다",
        });
      }

      await resumeService.deleteResumeByResumeId(resumeId, user);

      return res.status(201).end();
    };
  };
}
