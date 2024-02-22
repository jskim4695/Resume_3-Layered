import { usersRepository } from "../repositories/users.repository.js";
import sha256 from "cypto-js/sha256";
import jwt from "jsonwebtoken";

export class UsersService {
  usersRepository = new UsersRepository();

  userSignUp = async (data) => {
    const { email, clientId, password, name, grade } = data;

    // clientId (kakao)
    if (clientId) {
      const user = await usersRepository.selectOneUserbyClientId(clientId);

      if (user) {
        throw {
          code: 400,
          message: "이미 가입된 사용자 입니다.",
        };
      }

      await usersRepository.createUser({
        clientId,
        name,
        grade,
      });
    } else {
      // email
      const user = await usersRepository.selectOneUserbyEmail(email);

      if (user) {
        throw {
          code: 400,
          message: "이미 가입된 이메일 입니다.",
        };
      }

      await await usersRepository.createUser({
        email,
        password: sha256(password).toString(),
        name,
        grade,
      });
    }
  };

  userSignIn = async ({ clientId, email, password }) => {
    let user;
    if (clientId) {
      // 카카오 로그인
      user = await usersRepository.selectOneUserbyClientId(clientId);

      if (!user) {
        throw {
          code: 401,
          message: "올바르지 않은 로그인 정보입니다.",
        };
      }
    } else {
      // email 로그인
      if (!email) {
        throw {
          code: 400,
          message: "이메일은 필수값입니다.",
        };
      }

      if (!password) {
        throw {
          code: 400,
          message: "비밀번호는 필수값입니다.",
        };
      }

      user = await usersRepository.selectOneUserbyEmailAndPassword(
        email,
        password
        // TODO 수정필요
      );

      if (!user) {
        throw {
          code: 401,
          message: "올바르지 않은 로그인 정보입니다.",
        };
      }
    }

    // 로그인 성공
    const accessToken = jwt.sign({ userId: user.userId }, "resume@#", {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign({ userId: user.userId }, "resume&%*", {
      expiresIn: "7d",
    });
    return {
      accessToken,
      refreshToken,
    };
  };
}
