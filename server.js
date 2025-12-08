import http from "http";
import path from "path";
import fs from "fs";
import fsPromises from "fsPromises";
import EventEmitter from "events";

import { logEvents } from "./logs/logEvents.txt";

class TheEmitter extends EventEmitter {}
const emitter = new TheEmitter();

emitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 8080;


//Hjelpefunksjoner for filbehandling

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData
    } catch (err) {
        console.error(err)
    }
} 