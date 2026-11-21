/**
 * Popula o banco com um usuário e notícias de exemplo para a demonstração.
 * Uso: npm run seed   (ou: docker compose exec backend npm run seed)
 * Só insere dados se a coleção de usuários estiver vazia.
 */
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

const DEMO_USER = {
  name: "Redação SertãoNews",
  username: "redacao",
  email: "demo@sertaonews.dev",
  password: "demo123",
  avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Sert%C3%A3o%20News",
  background: "https://picsum.photos/seed/redacao/1200/400",
};

const DEMO_POSTS = [
  {
    title: "Stack MERN chega à sala de aula",
    banner: "https://picsum.photos/seed/mern/800/500",
    text: "MongoDB, Express, React e Node.js formam uma stack que usa JavaScript de ponta a ponta. Neste projeto, o back-end expõe uma API REST protegida por JWT e o front-end em React consome essa API.",
  },
  {
    title: "Docker simplifica a execução de aplicações",
    banner: "https://picsum.photos/seed/docker/800/500",
    text: "Com um único docker compose up, o banco de dados, a API e a interface sobem juntos, cada um em seu contêiner, sem precisar instalar o MongoDB na máquina.",
  },
  {
    title: "Segurança básica em APIs REST",
    banner: "https://picsum.photos/seed/seguranca/800/500",
    text: "Hash de senhas com bcrypt, tokens JWT, CORS restrito, validação de entrada e sanitização contra NoSQL injection são práticas essenciais para qualquer API.",
  },
];

async function seed() {
  await connectDatabase();

  if (await User.estimatedDocumentCount()) {
    console.log("O banco já possui dados, seed ignorado.");
    return;
  }

  const user = await User.create(DEMO_USER);
  await Post.insertMany(DEMO_POSTS.map((post) => ({ ...post, user: user._id })));

  console.log(`Seed concluído. Login: ${DEMO_USER.email} / ${DEMO_USER.password}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
