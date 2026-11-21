import mongoose from "mongoose";
import env from "./env.js";

// Impede que filtros com campos desconhecidos sejam repassados ao MongoDB
mongoose.set("strictQuery", true);

export async function connectDatabase() {
  await mongoose.connect(env.databaseUrl, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB conectado");
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
