import http from "http";
import { app } from "./express";
import "dotenv/config";
import connectToDb from "./db/db";

connectToDb();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));
