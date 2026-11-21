import User from "../models/User.js";

const create = (data) => User.create(data);

const findById = (id) => User.findById(id);

const findByIdWithPassword = (id) => User.findById(id).select("+password");

const findByEmailWithPassword = (email) =>
  User.findOne({ email }).select("+password");

const existsByEmail = (email) => User.exists({ email });

const existsByUsername = (username) => User.exists({ username });

const deleteById = (id) => User.findByIdAndDelete(id);

export default {
  create,
  findById,
  findByIdWithPassword,
  findByEmailWithPassword,
  existsByEmail,
  existsByUsername,
  deleteById,
};
