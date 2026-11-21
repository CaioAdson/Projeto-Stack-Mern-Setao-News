import Post from "../models/Post.js";
import escapeRegex from "../utils/escapeRegex.js";

const AUTHOR_FIELDS = "name username avatar";

// Popula o autor da notícia e o autor de cada comentário
function withAuthors(query) {
  return query
    .populate("user", AUTHOR_FIELDS)
    .populate("comments.user", AUTHOR_FIELDS);
}

const create = (data) => Post.create(data);

const findAll = (offset, limit) =>
  withAuthors(Post.find().sort({ createdAt: -1 }).skip(offset).limit(limit));

const count = () => Post.countDocuments();

const findLatest = () => withAuthors(Post.findOne().sort({ createdAt: -1 }));

const findById = (id) => withAuthors(Post.findById(id));

const findRawById = (id) => Post.findById(id);

const searchByTitle = (title) =>
  withAuthors(
    Post.find({ title: { $regex: escapeRegex(title), $options: "i" } })
      .sort({ createdAt: -1 })
      .limit(50)
  );

const findByUser = (userId) =>
  withAuthors(Post.find({ user: userId }).sort({ createdAt: -1 }));

const updateById = (id, fields) =>
  Post.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true });

const deleteById = (id) => Post.findByIdAndDelete(id);

const deleteByUser = (userId) => Post.deleteMany({ user: userId });

// Remove o like se já existir; retorna null quando o usuário ainda não tinha curtido
const removeLike = (id, userId) =>
  Post.findOneAndUpdate({ _id: id, likes: userId }, { $pull: { likes: userId } });

const addLike = (id, userId) =>
  Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

const addComment = (id, userId, message) =>
  Post.findByIdAndUpdate(
    id,
    { $push: { comments: { user: userId, message } } },
    { new: true, runValidators: true }
  );

const removeComment = (id, commentId) =>
  Post.findByIdAndUpdate(id, { $pull: { comments: { _id: commentId } } });

// Remove likes e comentários de um usuário em todas as notícias (exclusão de conta)
const removeUserInteractions = (userId) =>
  Post.updateMany({}, { $pull: { likes: userId, comments: { user: userId } } });

export default {
  create,
  findAll,
  count,
  findLatest,
  findById,
  findRawById,
  searchByTitle,
  findByUser,
  updateById,
  deleteById,
  deleteByUser,
  removeLike,
  addLike,
  addComment,
  removeComment,
  removeUserInteractions,
};
