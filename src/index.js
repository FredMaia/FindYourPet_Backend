import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Posts from "./app/controllers/Posts.js";
import Auth from "./app/controllers/Auth.js";
import Pets from "./app/controllers/Pets.js";
import Uploads from "./app/controllers/Uploads.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/posts", Posts);
app.use("/auth", Auth);
app.use("/uploads", Uploads);
app.use("/pets", Pets);

console.log(`server running at ${port}`);
app.listen(port);