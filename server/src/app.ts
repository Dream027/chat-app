import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route";
import cors from "cors";
import friendRoute from "./routes/friend.route";

const app = express();

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);

export { app };
