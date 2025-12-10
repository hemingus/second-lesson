import http from "http";
import path from "path";
import fs from "fs";
import EventEmitter from "events";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { logEvents } from "./logEvents.js";

class TheEmitter extends EventEmitter {}
const emitter = new TheEmitter();

emitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 8080;

//Hjelpefunksjoner for filbehandling

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fs.promises.readFile(
            filePath,
            !contentType.includes("image") ? "utf8" : ""
        );
        const data =
            contentType === "application.json" ? JSON.parse(rawData) : rawData;

        response.writeHead(filePath.includes("404.html") ? 404 : 200),
            { "Content-Type": contentType };

        response.end(
            contentType === "application.json" ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.error(err);
        emitter.emit("log", `${err.name} : ${err.message}`, "errLog.txt");
        response.statusCode = 500;
        response.end();
    }
};

//Webserveren
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    emitter.emit("log", `${req.url}\t ${req.method}`, "reqLog.txt");
    let contentType;

    const extention = path.extname(req.url);

    switch (extention) {
        case ".css":
            contentType = "text/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".jpg":
        case ".jpeg":
            contentType = "image/jpg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".txt":
            contentType = "text/plain";
            break;

        default:
            contentType = "text/html";
    }

    //sett korrekt path
    let filePath =
        contentType === "text.html" && req.url === "/"
            ? path.join(__dirname, "views", "index.html")
            : contentType && req.url.slice(-1) === "/"
                ? path.join(__dirname, "views", req.url, "index.html")
                : contentType === "text.html"
                    ? path.join(__dirname, "views", req.url)
                    : path.join(__dirname, req.url);

    //hvis ikke fileextention og ikke slutter med /, antar vi .html

    if (!extention && req.url.slice(-1) !== "/") filePath += ".html";

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        //lever ønsket fil til klient
        serveFile(filePath, contentType, res);
    } else {
        //404 feil eller redirect

        switch (path.parse(filePath).base) {
            //legg inn andre caser hvis du vil som f.exs. rederecter til "/"
            case "old-page.html":
                res.writeHead(301, {"Location": "/new-page.html"});
                res.end();
                break;
            case "www-index.html":
                res.writeHead(301, {"Location": "/"});
                res.end();
                break;
            default:
                serveFile(
                    path.join(__dirname, "views", "404.html"),
                    "text/html",
                    res
                );
        }
    }
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
