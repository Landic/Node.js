import express from "express";
import { dbConnection } from "./config/dbConnection";
import { userRoutes } from "./routes/userRoutes";
import { roleRoutes } from "./routes/roleRoutes";
import { adRoutes } from "./routes/adRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { authRoutes } from "./routes/authRoutes";
import "dotenv/config";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/users", userRoutes);
server.use("/roles", roleRoutes);
server.use("/ads", adRoutes);
server.use("/categories", categoryRoutes);
server.use("/messages", messageRoutes);
server.use("/auth", authRoutes);

dbConnection.sync()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));