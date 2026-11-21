import AppError from "../utils/AppError.js";
import { serializeAuthor, serializeUser } from "../utils/serializers.js";
import userRepository from "../repositories/user.repository.js";
import postRepository from "../repositories/post.repository.js";

async function getMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError("Usuário não encontrado", 404);
  return serializeUser(user);
}

// Perfil público: não expõe o e-mail
async function getPublicProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError("Usuário não encontrado", 404);
  return { ...serializeAuthor(user), background: user.background, createdAt: user.createdAt };
}

async function updateMe(userId, fields) {
  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) throw new AppError("Usuário não encontrado", 404);

  if (fields.email && fields.email !== user.email && (await userRepository.existsByEmail(fields.email))) {
    throw new AppError("Este e-mail já está cadastrado", 409);
  }
  if (
    fields.username &&
    fields.username !== user.username &&
    (await userRepository.existsByUsername(fields.username))
  ) {
    throw new AppError("Este username já está em uso", 409);
  }

  // Atribui só os campos validados; save() dispara validações e o hash da senha
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) user[key] = value;
  });
  await user.save();

  return serializeUser(user);
}

async function deleteMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError("Usuário não encontrado", 404);

  await postRepository.deleteByUser(userId);
  await postRepository.removeUserInteractions(userId);
  await userRepository.deleteById(userId);
}

export default { getMe, getPublicProfile, updateMe, deleteMe };
