import express from "express";
import { connection } from "./config/db";
import { userRouter } from "./routes/user-router";
import { roleRouter } from "./routes/role-router";
import { advertisementRouter } from "./routes/ad-router";
import { categoryRouter } from "./routes/category-router";
import { messageRouter } from "./routes/message-router";
import { authRouter } from "./routes/auth-router";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use("/advertisements", advertisementRouter);
app.use("/category", categoryRouter);
app.use("/message", messageRouter);
app.use("/auth", authRouter);
connection.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running https://localhost:${process.env.PORT}`);
    });
}).catch((error) => console.log("DB connection error:", error));