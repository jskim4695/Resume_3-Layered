export class ResumeService {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  // 이력서 조회
  findAllResume = async () => {
    const resumes = await this.resumeRepository.findAllResume();

    resumes.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return resumes.map((resume) => {
      return {
        resumeId: resume.resumeId,
        title: resume.title,
        status: resume.status,
        createdAt: resume.status,
      };
    });
  };
  // 이력서 상세 조회
  findResumeById = async (resumeId) => {
    const resume = await this.resumeRepository.findResumeById(resumeId);

    return {
      resumeId: resume.resumeId,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.status,
    };
  };

  crateResume = async (userId, title, content) => {
    const createdResume = await this.resumeRepository.createResume(
      userId,
      title,
      content
    );

    return {
      resumeId: createdResume.resumeId,
      userId: createdResume.userId,
      title: createdResume.title,
      content: createdResume.content,
      status: createdResume.status,
      createdAt: createdResume.createdAt,
    };
  };

  updateResume = async (resumeId, title, content, status) => {
    const resume = await this.resumeRepository.findResumeById(resumeId);

    await this.resumeRepository.updateResume(resumeId, title, content, status);

    const updatedResume = await this.resumeRepository.findResumeById(resumeId);

    return {
      resumeId: updatedResume.resumeId,
      title: updatedResume.title,
      content: updatedResume.content,
      status: updatedResume.status,
    };
  };

  deleteResume = async (userId, resumeId) => {
    const resume = await this.resumeRepository.findResumeById(resumeId);
    if (!resume) throw new Error("존재하지 않는 이력서입니다.");

    await this.resumeRepository.deleteResume(userId, resumeId);

    return {
      resumeId: resume.resumeId,
      title: resume.title,
      content: resume.content,
      createdAt: resume.createdAt,
    };
  };
}
