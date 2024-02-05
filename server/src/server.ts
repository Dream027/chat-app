import { createServer } from "https";
import { app } from "./app";
import { join } from "path";
import "dotenv/config";
import { readFileSync } from "fs";

const server = createServer(
    {
        key: readFileSync(join(__dirname, process.env.SSL_KEY!!)),
        cert: readFileSync(join(__dirname, process.env.SSL_CERT!!)),
    },
    app
);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
