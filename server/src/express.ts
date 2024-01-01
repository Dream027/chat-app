import express from "express";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/users.route";

const app = express();

app.use(
    express.json({
        limit: "15kb",
    }),
);
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
