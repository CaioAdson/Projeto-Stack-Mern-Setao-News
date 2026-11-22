# 🌵 SertãoNews — Portal de Notícias do Interior (MERN)

Aplicação web completa de um portal de notícias, construída com a stack **MERN** (MongoDB, Express, React e Node.js) e empacotada com **Docker**.

Usuários se cadastram, fazem login e podem **publicar, editar e excluir notícias**, além de **curtir** e **comentar** as notícias de outros usuários. Visitantes podem ler e pesquisar notícias sem login.

> Trabalho final da disciplina de Desenvolvimento Web — AP2.

## 👥 Integrantes

| Nome | Foco principal |
| ---- | -------------- |
| Caio Adson | Back-end |
| Mateus Peixoto | Front-end |

---

## ✨ Funcionalidades

- **Autenticação**: cadastro e login com senha protegida por hash (bcrypt) e sessão via token JWT.
- **CRUD de notícias**: criar, listar (com paginação), visualizar, editar e excluir. Só o autor pode alterar a própria notícia.
- **Busca** de notícias por título.
- **Curtidas** (curtir/descurtir) e **comentários**. O autor do comentário e o autor da notícia podem apagar um comentário.
- **Perfil**: página do usuário logado com suas notícias, edição de dados (nome, username, e-mail, avatar, capa e senha) e exclusão da conta.
- **Perfil público** de outros autores.
- Interface responsiva (desktop e celular).

## 🧱 Tecnologias

| Camada | Tecnologias |
| ------ | ----------- |
| Banco de dados | MongoDB 7 (contêiner Docker) |
| ODM | Mongoose 8 (schemas, validações, relacionamentos com `ref`/`populate`) |
| Back-end | Node.js 22, Express 4, jsonwebtoken, bcrypt, zod, helmet, cors, express-rate-limit, dotenv |
| Front-end | React 18, Vite 5, React Router 6, axios, react-hook-form + zod, styled-components |
| Infra | Docker, Docker Compose, nginx (serve o front e faz proxy para a API) |

## 🗂️ Estrutura do repositório

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # variáveis de ambiente e conexão com o MongoDB
│   │   ├── controllers/    # recebem a requisição e devolvem a resposta HTTP
│   │   ├── middlewares/    # auth (JWT), validação, sanitização e tratamento de erros
│   │   ├── models/         # schemas do Mongoose (User, Post)
│   │   ├── repositories/   # acesso ao banco (consultas do Mongoose)
│   │   ├── routes/         # Express Router (auth, users, posts)
│   │   ├── services/       # regras de negócio
│   │   ├── validators/     # schemas zod de validação de entrada
│   │   ├── utils/          # AppError, asyncHandler, serializers...
│   │   ├── scripts/seed.js # dados de exemplo para a demonstração
│   │   ├── app.js          # configuração do Express
│   │   └── server.js       # ponto de entrada
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Button, Input, NewsCard, ProtectedRoute, Feedback, Panel
│   │   ├── context/        # AuthContext (estado de autenticação)
│   │   ├── pages/          # Home, Search, NewsDetail, Authentication, Profile, EditProfile, ManageNews
│   │   ├── schemas/        # validações dos formulários (zod)
│   │   ├── services/       # chamadas à API (axios)
│   │   └── App.jsx         # rotas
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

O back-end segue a arquitetura em camadas **routes → controllers → services → repositories → models**, separando HTTP, regra de negócio e acesso ao banco.

---

## 🚀 Como executar (Docker — recomendado)

Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

```bash
git clone https://github.com/CaioAdson/Projeto-Stack-Mern-Setao-News.git
cd Projeto-Stack-Mern-Setao-News
```

1. Crie o arquivo `.env` a partir do exemplo e troque os valores:

```bash
cp .env.example .env
```

   - `MONGO_PASSWORD`: senha do banco (use só letras e números).
   - `JWT_SECRET`: um segredo longo e aleatório. Para gerar um:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

2. Suba os três contêineres (MongoDB, API e front-end):

```bash
docker compose up -d --build
```

3. (Opcional) Popule o banco com um usuário e notícias de exemplo:

```bash
docker compose exec backend npm run seed
```

   Login de demonstração: `demo@sertaonews.dev` / `demo123`

4. Acesse:
   - Aplicação: **http://localhost:8080**
   - API: **http://localhost:3001/api** (ex.: http://localhost:3001/api/health)

Para parar: `docker compose down` (os dados continuam no volume `mongo-data`). Para apagar também os dados: `docker compose down -v`.

> **Porta ocupada?** Se 8080, 3001 ou 27017 já estiverem em uso na sua máquina, defina outras no `.env` (`FRONTEND_PORT`, `API_PORT`, `MONGO_PORT`).

### Comandos úteis

| Para... | Comando |
| ------- | ------- |
| Ver o estado dos contêineres (todos devem ficar `healthy`) | `docker compose ps` |
| Acompanhar os logs da API | `docker compose logs -f backend` |
| Recriar as imagens depois de alterar o código | `docker compose up -d --build` |
| Abrir o shell do MongoDB | `docker compose exec mongo mongosh -u <MONGO_USER> -p <MONGO_PASSWORD> --authenticationDatabase admin sertaonews` |
| Parar tudo | `docker compose down` |
| Parar e apagar os dados do banco | `docker compose down -v` |

Os três serviços têm *healthcheck*: o Mongo responde a `ping`, a API a `GET /api/health` e o nginx a `GET /healthz`. A API só sobe depois que o Mongo está saudável, e o front só depois da API.

> **Docker Hub inacessível?** Se o build falhar com `TLS handshake timeout` ao baixar `node:22-slim` ou `nginx:1.27-alpine` (acontece em algumas redes), baixe as imagens base pelo espelho do Google e rode o build de novo:
>
> ```bash
> docker pull mirror.gcr.io/library/node:22-slim && docker tag mirror.gcr.io/library/node:22-slim node:22-slim
> docker pull mirror.gcr.io/library/nginx:1.27-alpine && docker tag mirror.gcr.io/library/nginx:1.27-alpine nginx:1.27-alpine
> docker pull mirror.gcr.io/library/mongo:7 && docker tag mirror.gcr.io/library/mongo:7 mongo:7
> ```

### Como os contêineres se comunicam

```
Navegador ──► frontend (nginx :8080) ──/api──► backend (Express :3001) ──► mongo (:27017)
```

O nginx serve o build do React e repassa as rotas `/api` para a API. Assim o navegador fala com uma única origem. O MongoDB fica acessível só dentro da rede do Docker (e em `127.0.0.1` para o MongoDB Compass), protegido por usuário e senha.

## 🛠️ Como executar em modo de desenvolvimento (sem Docker para a API/front)

Útil para programar com hot reload. Requer Node.js 20+.

1. Suba apenas o MongoDB pelo Docker:

```bash
docker compose up -d mongo
```

2. Back-end:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

   No `backend/.env`, use em `DATABASE_URL` o mesmo usuário/senha definidos no `.env` da raiz.

3. Front-end (em outro terminal):

```bash
cd frontend
npm install
npm run dev
```

   Acesse http://localhost:5173. O Vite redireciona `/api` para `http://localhost:3001`.

---

## 📡 Endpoints da API

Base: `/api`. Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`.

### Autenticação

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| POST | `/auth/register` | Cadastra usuário. Body: `name`, `email`, `password` (opcionais: `username`, `avatar`, `background`). Retorna `{ token, user }` |
| POST | `/auth/login` | Login. Body: `email`, `password`. Retorna `{ token, user }` |

### Usuários

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET 🔒 | `/users/me` | Dados do usuário logado |
| PATCH 🔒 | `/users/me` | Atualiza nome, username, e-mail, senha, avatar ou capa |
| DELETE 🔒 | `/users/me` | Exclui a conta (e suas notícias, curtidas e comentários) |
| GET | `/users/:id` | Perfil público (sem e-mail) |
| GET | `/users/:id/posts` | Notícias de um usuário |

### Notícias (entidade principal)

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/posts?limit=6&offset=0` | Lista paginada (mais recentes primeiro) |
| GET | `/posts/latest` | Notícia mais recente (destaque da home) |
| GET | `/posts/search?title=texto` | Busca por título |
| GET | `/posts/:id` | Detalhe com autor, curtidas e comentários |
| GET 🔒 | `/posts/me` | Notícias do usuário logado |
| POST 🔒 | `/posts` | Cria. Body: `title`, `banner` (URL http/https), `text` |
| PATCH 🔒 | `/posts/:id` | Atualiza (somente o autor) |
| DELETE 🔒 | `/posts/:id` | Exclui (somente o autor) |
| PATCH 🔒 | `/posts/:id/like` | Curtir / descurtir |
| POST 🔒 | `/posts/:id/comments` | Comenta. Body: `message` |
| DELETE 🔒 | `/posts/:id/comments/:commentId` | Apaga comentário (autor do comentário ou da notícia) |
| GET | `/health` | Status da API e do banco |

Respostas de erro seguem o formato `{ "message": "...", "errors": [{ "field", "message" }] }` com o status HTTP adequado (400, 401, 403, 404, 409, 429, 500).

### Modelo de dados

- **User**: `name`, `username` (único), `email` (único), `password` (hash bcrypt, nunca retornado), `avatar`, `background`, `createdAt`.
- **Post**: `user` (ref → User), `title`, `banner`, `text`, `likes` ([ref → User]), `comments` ([{ `user` (ref → User), `message`, `createdAt` }]), `createdAt`, `updatedAt`.

Relacionamentos: **usuário → notícias** (1:N), **usuário → curtidas** e **usuário → comentários**.

---

## 🔐 Segurança

| Requisito | Como foi feito |
| --------- | -------------- |
| Hash de senha | `bcrypt` (10 rounds) em hook `pre("save")` do Mongoose. O campo tem `select: false` e nunca volta nas respostas. |
| JWT | Token assinado com `JWT_SECRET` (via `.env`), expira em 1 dia. O middleware `auth` valida o token e confirma que o usuário ainda existe. |
| Autorização | Só o autor pode editar/excluir sua notícia (403 caso contrário). |
| CORS | Apenas as origens de `CORS_ORIGIN` são aceitas, com métodos e headers restritos. |
| Validação de entrada | Schemas **zod** em todos os endpoints (tipos, tamanhos, formato de e-mail, URLs, ObjectId). Campos não previstos são descartados (evita *mass assignment*, ex.: enviar `user` ou `likes` ao criar notícia). Validações também nos schemas do Mongoose. |
| NoSQL injection | Middleware que remove chaves iniciadas com `$` ou com `.`; zod exige strings onde se espera texto; `strictQuery` no Mongoose. Ex.: `{"email": {"$gt": ""}}` no login retorna 400. |
| Regex injection / ReDoS | O termo da busca é escapado antes de ir para o `$regex`. |
| XSS | O React escapa todo conteúdo renderizado (não usamos `dangerouslySetInnerHTML`). URLs de imagem só aceitam `http(s)://` (bloqueia `javascript:`). O nginx envia **Content-Security-Policy** que só permite scripts do próprio site. |
| Força bruta | `express-rate-limit` nas rotas de login/cadastro. |
| Cabeçalhos HTTP | `helmet` na API e cabeçalhos de segurança no nginx; `x-powered-by` desativado. |
| Segredos | `.env` no `.gitignore`; só os `.env.example` vão para o repositório. MongoDB com usuário e senha. |
| Erros | Middleware central devolve mensagens padronizadas sem stack trace. |

> Observação: o token é guardado no `localStorage`, abordagem comum em SPAs. Como mitigação de XSS, contamos com o escape do React e a CSP. Uma evolução possível seria usar cookie `httpOnly`.

---

## 🧪 Testando a API com Postman / Thunder Client

1. `POST http://localhost:3001/api/auth/login` com body JSON `{"email": "demo@sertaonews.dev", "password": "demo123"}`.
2. Copie o `token` da resposta.
3. Nas rotas 🔒, adicione o header `Authorization: Bearer <token>`.

## 🤝 Fluxo de trabalho da dupla (Git)

- `main` sempre estável; cada funcionalidade em uma branch (`feat/auth`, `feat/crud-posts`, `feat/front-profile`, `chore/docker`...).
- Integração por **Pull Request**, com revisão do outro integrante.
- Commits pequenos e descritivos, de preferência no padrão *Conventional Commits* (`feat:`, `fix:`, `docs:`, `refactor:`).

## 📚 Referência

Projeto inspirado no projeto BreakingNews, do curso da Codethi ([api-breakingnews](https://github.com/codethi/api-breakingnews) e [spa-breakingnews-new](https://github.com/codethi/spa-breakingnews-new)). Esta versão reorganiza o código em monorepo, adiciona validação, tratamento de erros, regras de autorização, comentários/curtidas no front, edição de perfil, MongoDB local via Docker e várias correções de segurança.
