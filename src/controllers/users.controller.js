import { UsersService } from "../services/users.service.js";

export class UsersController {
  usersService = new UsersService();

  userSignUp = async (req, res, next) => {
    try {
      const { email, password, checkPw, name } = req.body;

      const createdUsers = await this.usersService.createUsers(
        email,
        password,
        checkPw,
        name
      );

      return res.status(201).json({ data: createdUsers });
    } catch (err) {
      next(err);
    }
  };

  userSignIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const loggedUsers = await this.usersService.loginUsers(email, password);

      return res.status(200).json({ data: loggedUsers });
    } catch (err) {
      next(err);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const userId = res.locals.user;

      const users = await this.usersService.getUser(userId);

      return res.status(200).json({ data: users });
    } catch (err) {
      next(err);
    }
  };
}
