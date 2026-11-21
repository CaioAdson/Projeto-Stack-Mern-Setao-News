import AppError from "../utils/AppError.js";
import { serializePost } from "../utils/serializers.js";
import postRepository from "../repositories/post.repository.js";

async function findPostOrFail(id) {
  const post = await postRepository.findById(id);
  if (!post) throw new AppError("Notícia não encontrada", 404);
  return post;
}

// Garante que somente o autor altere ou exclua a notícia
async function findOwnPostOrFail(id, userId) {
  const post = await postRepository.findRawById(id);
  if (!post) throw new AppError("Notícia não encontrada", 404);
  if (post.user.toString() !== userId) {
    throw new AppError("Você não tem permissão para alterar esta notícia", 403);
  }
  return post;
}

async function create(fields, userId) {
  const post = await postRepository.create({ ...fields, user: userId });
  return serializePost(await postRepository.findById(post._id));
}

async function list({ limit, offset }) {
  const [posts, total] = await Promise.all([
    postRepository.findAll(offset, limit),
    postRepository.count(),
  ]);

  return {
    total,
    limit,
    offset,
    nextOffset: offset + limit < total ? offset + limit : null,
    previousOffset: offset > 0 ? Math.max(offset - limit, 0) : null,
    results: posts.map(serializePost),
  };
}

async function latest() {
  const post = await postRepository.findLatest();
  return post ? serializePost(post) : null;
}

async function search(title) {
  const posts = await postRepository.searchByTitle(title);
  return posts.map(serializePost);
}

async function findById(id) {
  return serializePost(await findPostOrFail(id));
}

async function findByUser(userId) {
  const posts = await postRepository.findByUser(userId);
  return posts.map(serializePost);
}

async function update(id, fields, userId) {
  await findOwnPostOrFail(id, userId);
  await postRepository.updateById(id, fields);
  return findById(id);
}

async function remove(id, userId) {
  await findOwnPostOrFail(id, userId);
  await postRepository.deleteById(id);
}

async function toggleLike(id, userId) {
  await findPostOrFail(id);

  const removed = await postRepository.removeLike(id, userId);
  if (!removed) await postRepository.addLike(id, userId);

  const post = await findPostOrFail(id);
  return { liked: !removed, likes: post.likes.map(String) };
}

async function addComment(id, userId, message) {
  await findPostOrFail(id);
  await postRepository.addComment(id, userId, message);
  return findById(id);
}

async function removeComment(id, commentId, userId) {
  const post = await postRepository.findRawById(id);
  if (!post) throw new AppError("Notícia não encontrada", 404);

  const comment = post.comments.id(commentId);
  if (!comment) throw new AppError("Comentário não encontrado", 404);

  // Pode apagar: o autor do comentário ou o autor da notícia (moderação)
  const canDelete = comment.user.toString() === userId || post.user.toString() === userId;
  if (!canDelete) throw new AppError("Você não pode apagar este comentário", 403);

  await postRepository.removeComment(id, commentId);
  return findById(id);
}

export default {
  create,
  list,
  latest,
  search,
  findById,
  findByUser,
  update,
  remove,
  toggleLike,
  addComment,
  removeComment,
};
