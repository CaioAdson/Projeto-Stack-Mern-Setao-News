import userService from "../services/user.service.js";

async function getMe(req, res) {
  res.json(await userService.getMe(req.userId));
}

async function updateMe(req, res) {
  res.json(await userService.updateMe(req.userId, req.body));
}

async function deleteMe(req, res) {
  await userService.deleteMe(req.userId);
  res.status(204).end();
}

async function getById(req, res) {
  res.json(await userService.getPublicProfile(req.params.id));
}

export default { getMe, updateMe, deleteMe, getById };
