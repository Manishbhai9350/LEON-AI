import { UserModel } from "../models/User.model.js";
import { Verify } from "../services/jwt.js";
import RedisCLI from "../services/Redis.js";

export const IsUserAuthenticated = async (req, res, next) => {
  try {
    const Token =
      req.cookies.token || req?.headers?.authorization?.split(" ")[1] || "";

    if (!Token) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      });
    }

    const IsBlackListed = await RedisCLI.get(Token);

    if (IsBlackListed) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      });
    }

    const Decoded = await Verify(Token || "");

    const User = await UserModel.findById(Decoded.id);

    if (!User) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      });
    }

    req.User = User;
    return next();
  } catch (error) {
    if (process.env.ENV == "dev") {
      console.log(error);
    }
    res.status(400).json({
      message: "UnAuthorized",
      success: false,
    });
  }
};
