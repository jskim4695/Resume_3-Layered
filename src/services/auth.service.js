import jwt from "jsonwebtoken";
import { UsersRepository } from "../repositories/users.repository";

export class AuthService {
  authService = new AuthService();

  verifyFreshToken = async (refreshToken) => {
    const token = jwt.verify(refreshToken, "resumeToken");
    if (!token.userId) {
      throw {
        code: 401,
        message: "토큰 정보가 올바르지 않습니다.",
      };
    }

    const user = await UsersRepository.findUserByUserId(token.userId);

    if (!user) {
      throw {
        code: 401,
        message: "토큰 정보가 올바르지 않습니다.",
      };
    }

    const newAccessToken = jwt.sign({ userId: user.userId }, "secret-key", {
      expiresIn: "12h",
    });
    const newRefreshToken = jwt.sign({ userId: user.userId }, "resumeToken", {
      expiresIn: "7d",
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };
}
