import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: [true, "O comentário não pode ser vazio"],
      trim: true,
      maxlength: [500, "O comentário deve ter no máximo 500 caracteres"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const PostSchema = new mongoose.Schema(
  {
    // Relacionamento: cada notícia pertence a um usuário (autor)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
      minlength: [3, "O título deve ter no mínimo 3 caracteres"],
      maxlength: [150, "O título deve ter no máximo 150 caracteres"],
    },
    banner: {
      type: String,
      required: [true, "O banner é obrigatório"],
      trim: true,
      match: [/^https?:\/\/\S+$/i, "O banner deve ser uma URL http(s) válida"],
    },
    text: {
      type: String,
      required: [true, "O texto é obrigatório"],
      trim: true,
      maxlength: [10000, "O texto deve ter no máximo 10000 caracteres"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", PostSchema);

export default Post;
