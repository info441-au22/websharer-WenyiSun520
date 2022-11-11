import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import msIdExpress from "microsoft-identity-express";
const appSettings = {
  appCredentials: {
    clientId: "8c15ea7e-f9f6-4552-b3a1-fff19c5c024f",
    tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "_Wz8Q~NHVWWfTcxrUDIJNnbmSCSkqCIBo-HdlaNM",
  },
  authRoutes: {
    // redirect:"http://localhost:3000/redirect",
    redirect: "https://www.wenyis.tech/redirect",
    error: "/error",
    unauthorized: "/unauthorized",
  },
};

import apiv3Router from "./routes/api/v3/apiv3.js"; // load apiv3 router
import models from "./models.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
// middleware:
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  req.models = models;
  next();
});
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "this8is7a6secret5of4a5",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
  })
);
app.use("/api/v3/", apiv3Router);

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());


app.get("/signin", msid.signIn({ postLoginRedirect: "/" }));
app.get("/signout", msid.signOut({ postLogoutRedirect: "/" }));
app.get("/error", (req, res) => {
  res.status(500).send("Error: Server error");
});
app.get("/unauthorized", (req, res) => {
  res.status(401).send("Error: Unauthorized");
});

export default app;
