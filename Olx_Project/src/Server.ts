import express from "express";
import { connection } from "./config/DB";
import { userRouter } from "./routes/UserRouter";
import { roleRouter } from "./routes/RoleRouter";
import { advertisementRouter } from "./routes/AdvertisementRouter";
import { categoryRouter } from "./routes/CategoryRouter";
import { messageRouter } from "./routes/MessageRouter";
import { authRouter } from "./routes/AuthRouter";
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
        console.log(`Server is running http://localhost:${process.env.PORT}`);
    });
}).catch((error) => console.log("DB connection error:", error));