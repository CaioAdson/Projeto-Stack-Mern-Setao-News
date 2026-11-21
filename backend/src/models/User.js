import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const URL_REGEX = /^https?:\/\/\S+$/i;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
      minlength: [3, "O nome deve ter no mínimo 3 caracteres"],
      maxlength: [60, "O nome deve ter no máximo 60 caracteres"],
    },
    username: {
      type: String,
      required: [true, "O username é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_-]{3,30}$/, "Username inválido"],
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido"],
    },
    password: {
      type: String,
      required: [true, "A senha é obrigatória"],
      minlength: [6, "A senha deve ter no mínimo 6 caracteres"],
      // Nunca retorna o hash da senha nas consultas, a menos que seja pedido explicitamente
      select: false,
    },
    avatar: {
      type: String,
      required: true,
      match: [URL_REGEX, "A URL do avatar deve começar com http:// ou https://"],
    },
    background: {
      type: String,
      required: true,
      match: [URL_REGEX, "A URL do fundo deve começar com http:// ou https://"],
    },
  },
  { timestamps: true }
);

// Faz o hash da senha apenas quando ela foi criada ou alterada
UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

UserSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
