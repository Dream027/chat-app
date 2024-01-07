import express from "express";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/users.route";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        // credentials: true,
    }),
);
app.use(express.json());
app.use(
    express.urlencoded({
        limit: "15kb",
        extended: true,
    }),
);
app.use(cookieParser());

// Routes
app.use("/api/v1/users", usersRoute);

export { app };
