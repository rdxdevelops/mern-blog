import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  //we need a package called cookie-parser to parse the cookies and we'll use it in the index.js file using app.use(cookieParser())
  const token = req.cookies.access_token;
  if (!token) {
    next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};
