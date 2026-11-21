import express from "express";
import cors from "cors";
import helmet from "helmet";
import env from "./config/env.js";
import routes from "./routes/index.js";
import sanitize from "./middlewares/sanitize.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // a API roda atrás do nginx no Docker

// Cabeçalhos de segurança HTTP
app.use(helmet());

// CORS: apenas as origens configuradas podem chamar a API pelo navegador
app.use(
  cors({
    origin(origin, callback) {
      // Requisições sem Origin (Postman, curl, servidor-servidor) são permitidas
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(sanitize);

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
