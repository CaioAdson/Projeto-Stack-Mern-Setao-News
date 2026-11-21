import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";
import { serializeUser } from "../utils/serializers.js";
import userRepository from "../repositories/user.repository.js";

export function generateToken(userId) {
  return jwt.sign({}, env.jwtSecret, { subject: String(userId), expiresIn: env.jwtExpiresIn });
}

function defaultAvatar(name) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

const DEFAULT_BACKGROUND = "https://picsum.photos/seed/sertaonews/1200/400";

// Gera um username a partir do nome: "Maria Silva" -> "mariasilva-4821"
async function generateUsername(name) {
  const base =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20) || "user";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await userRepository.existsByUsername(candidate))) return candidate;
  }
  throw new AppError("Não foi possível gerar um username, informe um manualmente", 409);
}

async function register({ name, email, password, username, avatar, background }) {
  if (await userRepository.existsByEmail(email)) {
    throw new AppError("Este e-mail já está cadastrado", 409);
  }
  if (username && (await userRepository.existsByUsername(username))) {
    throw new AppError("Este username já está em uso", 409);
  }

  const user = await userRepository.create({
    name,
    email,
    password, // o hash é feito no hook pre("save") do model
    username: username || (await generateUsername(name)),
    avatar: avatar || defaultAvatar(name),
    background: background || DEFAULT_BACKGROUND,
  });

  return { token: generateToken(user._id), user: serializeUser(user) };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmailWithPassword(email);

  // Mesma mensagem para e-mail e senha incorretos: não revela quais e-mails existem
  const valid = user && (await user.comparePassword(password));
  if (!valid) throw new AppError("E-mail ou senha incorretos", 401);

  return { token: generateToken(user._id), user: serializeUser(user) };
}

export default { register, login };
