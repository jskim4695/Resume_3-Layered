import { resumeRepository } from "../repositories/resume.repository";

export class ResumeService {
  // 이력서 조회
  findAllSortedResumes = async (sort) => {
    const resumes = await resumeRepository.selectAllSortedResumes(sort);
    return resumes;
  };
  // 이력서 상세 조회
  findResumeById = async (resumeId) => {
    const resumes = await resumeRepository.selectOneResumeByResumeId(resumeId);
    return resumes;

    // const resume = await this.resumeRepository.findResumeById(resumeId);

    // return {
    //   resumeId: resume.resumeId,
    //   title: resume.title,
    //   content: resume.content,
    //   status: resume.status,
    //   createdAt: resume.status,
    // };
  };

  crateResume = async (title, content, userId) => {
    await resumeRepository.createResume({
      title,
      content,
      status: "APPLY",
      userId,
    });
  };

  updateResumeByResumeId = async (resumeId, data, byUser) => {
    const resume = await resumeRepository.selectOneResumeByResumeId(resumeId);

    if (!resume) {
      throw {
        code: 401,
        message: "존재하지 않는 이력서 입니다.",
      };
    }

    if (byUser.grade === "user" && resume.userId !== byUser.userId) {
      throw {
        code: 401,
        message: "올바르지 않은 요청입니다.",
      };
    }

    const { title, content, status } = data;
    await resumeRepository.updateResumeByResumeId(resumeId, {
      title,
      content,
      status,
    });
  };

  deleteResumeByResumeId = async (resumeId, byUser) => {
    const resume = await resumeRepository.selectOneResumeByResumeId(resumeId);

    if (!resume) {
      throw {
        code: 400,
        message: "존재하지 않는 이력서 입니다.",
      };
    }

    if (resume.userId !== byUser.userId) {
      throw {
        code: 400,
        message: "올바르지 않은 요청입니다.",
      };
    }

    await resumeRepository.deleteResumeByResumeId(resumeId);
  };
}
