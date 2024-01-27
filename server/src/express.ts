import express from "express";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/users.route";
import cors from "cors";
import friendsRoute from "./routes/friends.route";
import groupRoute from "./routes/group.route";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
);
app.use(express.json());
app.use(
    express.urlencoded({
        limit: "25mb",
        extended: true,
    }),
);
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/friends", friendsRoute);
app.use("/api/v1/groups", groupRoute);

export { app };
