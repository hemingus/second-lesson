import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

// ES module replacements for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logEvents = async(message, logFileName) => {
    const date = new Date();
    const dateTime = `${date.toLocaleDateString()}\t${date.toLocaleTimeString}`
    const logItem = `${uuid()}\t${dateTime}\t${message}\n`;

    try {
        const logsDirectory = path.join(__dirname, "logs");
        //Opprett mappe hvis den ikke finnes
        if (!fs.existsSync(logsDirectory)) {
            await fs.promises.mkdir(logsDirectory);
        }

        await fs.promises.appendFile(path.join(logsDirectory, logFileName), 
        logItem);
    } 
    catch (err) {
        console.log(err)
    }
}

export { logEvents };