import http from "http";
import path from "path";
import fs from "fs";
import fsPromises from "fsPromises";
import EventEmitter from "events";

import { logEvents } from "./logs/logEvents.txt";

class TheEmitter extends EventEmitter {}
const emitter = new TheEmitter();
