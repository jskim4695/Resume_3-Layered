import AuthService from "../services/auth.service";

const generateNewAccessTokenByFreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const token = await AuthService.verifyFreshToken(refreshToken);
  return res.json(token);
};

export default router;
