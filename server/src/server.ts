// import { createServer } from "https";
import { createServer } from "http";
import { app } from "./app";
import { join } from "path";
import "dotenv/config";
import { readFileSync } from "fs";
import { connectToDb } from "./db";

// const server = createServer(
//     {
//         key: readFileSync(join(__dirname, process.env.SSL_KEY!!)),
//         cert: readFileSync(join(__dirname, process.env.SSL_CERT!!)),
//     },
//     app
// );

const server = createServer(app);

const PORT = process.env.PORT || 4000;
(async () => {
    await connectToDb();
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();
