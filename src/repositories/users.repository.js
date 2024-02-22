import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

export class UsersRepository {
  userRepository = new UsersRepository();

  selectOneUserbyClientId = async (clientId) => {
    const user = await prisma.users.findFirst({
      where: {
        clientId,
      },
    });
  };

  selectOneUserbyEmail = async (email) => {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });
  };

  selectOneUserbyEmailAndPassword = async (email, password) => {
    const user = await prisma.users.findFirst({
      where: {
        email,
        password,
      },
    });
  };

  createUser = async (date) => {
    await prisma.users.create({
      data,
    });
  };

  registerUsers = async (email, password, name) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const registeredUsers = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return registeredUsers;
  };

  findUserByUserId = async (userId) => {
    const user = await prisma.users.findUnique({
      where: { userId },
    });
    return user;
  };

  comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };
}
