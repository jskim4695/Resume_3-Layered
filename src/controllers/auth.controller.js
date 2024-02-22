import AuthService from "../services/auth.service";

export class AuthController {
  authController = new AuthController();

  generateNewAccessTokenByFreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    const token = await AuthService.verifyFreshToken(refreshToken);
    return res.json(token);
  };
}
