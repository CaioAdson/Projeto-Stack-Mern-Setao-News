import postService from "../services/post.service.js";

async function list(req, res) {
  res.json(await postService.list(req.query));
}

async function latest(req, res) {
  res.json({ post: await postService.latest() });
}

async function search(req, res) {
  res.json({ results: await postService.search(req.query.title) });
}

async function listMine(req, res) {
  res.json({ results: await postService.findByUser(req.userId) });
}

async function listByUser(req, res) {
  res.json({ results: await postService.findByUser(req.params.id) });
}

async function findById(req, res) {
  res.json(await postService.findById(req.params.id));
}

async function create(req, res) {
  res.status(201).json(await postService.create(req.body, req.userId));
}

async function update(req, res) {
  res.json(await postService.update(req.params.id, req.body, req.userId));
}

async function remove(req, res) {
  await postService.remove(req.params.id, req.userId);
  res.status(204).end();
}

async function toggleLike(req, res) {
  res.json(await postService.toggleLike(req.params.id, req.userId));
}

async function addComment(req, res) {
  res.status(201).json(await postService.addComment(req.params.id, req.userId, req.body.message));
}

async function removeComment(req, res) {
  res.json(await postService.removeComment(req.params.id, req.params.commentId, req.userId));
}

export default {
  list,
  latest,
  search,
  listMine,
  listByUser,
  findById,
  create,
  update,
  remove,
  toggleLike,
  addComment,
  removeComment,
};
