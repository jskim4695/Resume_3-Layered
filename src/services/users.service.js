import { UsersRepository } from "../repositories/users.repository.js";
import jwt from "jsonwebtoken";

export class UsersService {
  usersRepository = new UsersRepository();

  createUsers = async (email, password, checkPw, name) => {
    const createdUsers = await this.usersRepository.registerUsers(
      email,
      password,
      checkPw,
      name
    );

    return {
      email: createdUsers.email,
      name: createdUsers.name,
      createdAt: createdUsers.createdAt,
    };
  };

  loginUsers = async (email, password) => {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) throw new Error("존재하지 않는 이메일입니다.");

    const passwordMatch = await this.usersRepository.comparePassword(
      password,
      user.password
    );
    if (!passwordMatch) throw new Error("비밀번호가 일치하지 않습니다.");

    const accessToken = jwt.sign({ userId: user.userId }, "secret-key", {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign({ userId: user.userId }, "resumeToken", {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  };

  getUser = async (userId) => {
    const users = await this.usersRepository.getUserInfo(userId);
    return {
      email: users.email,
      name: users.name,
    };
  };
}
