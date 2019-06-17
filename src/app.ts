import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import expressValidator from "express-validator";
import { SESSION_SECRET } from "./util/secrets";


// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as apiController from "./controllers/api";

// Create Express server
const app = express();


// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
}));

/**
 * API examples routes.
 */
app.get("/balances/:balanceID", apiController.balance);
app.post("/balances");

app.get("/deposits")
app.get("/deposits/:id")
app.get("/deposits/:id")

app.post("/withdraw")
app.post("/transfer")



export default app;