import app from "./app.js";
import env from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

async function start() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("Falha ao conectar no MongoDB:", error.message);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`API rodando em http://localhost:${env.port}/api`);
  });

  // Encerramento gracioso (docker stop envia SIGTERM)
  const shutdown = (signal) => {
    console.log(`${signal} recebido, encerrando...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start();
