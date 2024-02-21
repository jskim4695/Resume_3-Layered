import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  try {
    //header에서 accessToken 가져오기
    const authorization = req.headers.authorization;
    if (!authorization)
      throw new Error("요청한 사용자의 토큰이 존재하지 않습니다.");

    // 인증방식이 올바른가 - jwt(Bearer)
    const [tokenType, tokenValue] = authorization.split(" ");
    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 Bearer 형식이 아닙니다.");

    // 12h의 유효기간이 남아있는가?
    const token = jwt.verify(tokenValue, "secret-key");

    const user = await prisma.users.findFirst({
      where: { userId: token.userId },
    });
    if (!user) {
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    // user 정보 담기
    res.locals.user = user;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// import jwt from "jsonwebtoken";
// import { prisma } from "../utils/prisma/index.js";

// export default async function (req, res, next) {
//   try {
//     const { authorization } = req.cookies;
//     if (!authorization)
//       throw new Error("요청한 사용자의 토큰이 존재하지 않습니다 .");

//     const [tokenType, token] = authorization.split(" ");
//     if (tokenType !== "Bearer")
//       throw new Error("토큰 타입이 Bearer 형식이 아닙니다.");

//     const decodedToken = jwt.verify(token, "secret-key");
//     const userId = decodedToken.userId;
//     if (!userId) throw new Error("로그인이 필요합니다.");

//     const user = await prisma.users.findFirst({
//       where: { userId: +userId },
//     });
//     if (!user) throw new Error("토큰 사용자가 존재하지 않습니다.");

//     req.user = { userId: user.userId };
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "토큰이 만료되었습니다." });
//     }
//     return res.status(400).json({ message: error.message });
//   }
// }
