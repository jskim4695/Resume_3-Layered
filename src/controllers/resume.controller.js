export class ResumeController {
  constructor(resumeService) {
    this.resumeService = resumeService;
  }
  // 이력서 조회 api
  getResumes = async (req, res, next) => {
    try {
      const resumes = await this.resumeService.findAllResume();

      return res.status(200).json({ data: resumes });
    } catch (err) {
      next(err);
    }
  };

  // 이력서 상세 조회
  getResumeById = async (req, res, next) => {
    try {
      const { resumeId } = req.params;

      const resume = await this.resumeService.findResumeById(postId);

      return res.status(200).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };

  // 이력서 생성
  createResume = async (req, res, next) => {
    try {
      const userId = res.locals.user;
      const { title, content } = req.body;

      const createdResume = await this.resumeService.crateResume(
        userId,
        title,
        content
      );

      return res.status(201).json({ data: createdResume });
    } catch (err) {
      next(err);
    }
  };

  // 이력서 수정
  updateResume = async (req, res, next) => {
    try {
      const userId = res.locals.user;
      const { password, title, content } = req.body;

      const updatedResume = await this.resumeService.updateResume(
        userId,
        password,
        title,
        content
      );

      return res.status(200).json({ data: updatedResume });
    } catch (err) {
      next(err);
    }
  };

  // 게시글 삭제 api
  deleteResume = async (req, res, next) => {
    try {
      const userId = res.locals.user;
      const { password } = req.body;

      const deletedResume = await this.resumeService.deleteResume(
        postId,
        password
      );

      return res.status(200).json({ data: deletedResume });
    } catch (err) {
      next(err);
    }
  };
}
