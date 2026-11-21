/**
 * Converte documentos do Mongoose no formato enviado ao front-end.
 * Centralizar isso evita vazar campos internos (senha, __v, etc.).
 */
export function serializeUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    background: user.background,
    createdAt: user.createdAt,
  };
}

export function serializeAuthor(user) {
  if (!user || !user._id) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    avatar: user.avatar,
  };
}

export function serializePost(post) {
  return {
    id: post._id.toString(),
    title: post.title,
    banner: post.banner,
    text: post.text,
    author: serializeAuthor(post.user),
    likes: post.likes.map((userId) => userId.toString()),
    comments: post.comments.map((comment) => ({
      id: comment._id.toString(),
      message: comment.message,
      createdAt: comment.createdAt,
      author: serializeAuthor(comment.user),
    })),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
