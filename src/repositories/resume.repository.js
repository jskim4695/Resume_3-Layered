import { prisma } from "../utils/prisma/index.js";

export class ResumeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  resumeRepository = new ResumeRepository();

  selectAllSortedResumes = async (sort) => {
    const resumes = await prisma.resume.findMany({
      select: {
        resumeId: true,
        title: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: [
        {
          [orderKey]: sort.orderValue,
        },
      ],
    });
    return resumes;
  };

  selectOneResumeByResumeId = async (resumeId) => {
    const resume = await prisma.resume.findFirst({
      where: {
        resumeId: +resumeId,
      },
      select: {
        resumeId: true,
        title: true,
        content: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return resume;
  };

  createResume = async (data) => {
    await prisma.resume.create({
      data,
    });
  };
}

updateResumeByResumeId = async (resumeId, data) => {
  // 내가 작성한 이력서이거나 권한 등급이 admin이다.
  await prisma.resume.update({
    where: {
      resumeId: +resumeId,
    },
    data,
  });
};

deleteResumeByResumeId = async (resumeId) => {
  await prisma.resume.delete({
    where: {
      resumeId: +resumeId,
    },
  });
};
