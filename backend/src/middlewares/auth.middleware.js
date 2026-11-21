import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";
import userRepository from "../repositories/user.repository.js";

/**
 * Exige um token JWT válido no header "Authorization: Bearer <token>".
 * Em caso de sucesso, disponibiliza o id do usuário em req.userId.
 */
export default async function authMiddleware(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");

    if (!token || !/^Bearer$/i.test(scheme)) {
      throw new AppError("Token não informado ou mal formatado", 401);
    }

    const payload = jwt.verify(token, env.jwtSecret);

    const user = await userRepository.findById(payload.sub);
    if (!user) throw new AppError("Usuário do token não existe mais", 401);

    req.userId = user._id.toString();
    return next();
  } catch (error) {
    return next(error);
  }
}
