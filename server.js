 // imports
    // third party imports
    import express from "express"
    import path from "path"
    import { fileURLToPath } from "url";
    import cors from "cors";

    // first party imports
    import { logger } from "./middleware/logEvents.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3500;

const whitelist = ["https://www.thisSiteIsAllowed.com", "http://127.0.0.1:5500", "http://localhost:3500"];
const corsOptions = 
{
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS!"));
        }
    }, optionSuccessStatus: 200
}

// app.use
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(logger);
app.use(cors(corsOptions));

app.use(function (err, req, res, next){
    console.error(err.stack);
    res.status(500).send(err.message);
    next();
})

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
});

app.get("/new-page.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"))
});

app.get("/old-page.html", (req, res) => {
    res.redirect(301, "/new-page.html")
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));   
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

