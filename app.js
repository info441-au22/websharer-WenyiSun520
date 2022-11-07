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
    clientSecret: "5IF8Q~i0G_c8Kfth4WVv_z-vX3XF_9Qtxv0jWa~L",
  },
  authRoutes: {
    redirect: "https://wenyis.tech/redirect",
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
    resave: false,
  })
);
const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());
app.use("/api/v3/", apiv3Router);

app.get("/signin", msid.signIn({ postLoginRedirect: "/" }));
app.get("/signout", msid.signOut({ postLogoutRedirect: "/" }));
app.get("/error", (req, res) => {
  res.status(500).send("Error: Server error");
});
app.get("/unauthorized", (req, res) => {
  res.status(401).send("Error: Unauthorized");
});

// // use this by going to urls like: 
// // http://localhost:3000/fakelogin?name=anotheruser
// app.get('/fakelogin', (req, res) => {
//     let newName = req.query.name;
//     let session=req.session;
//     session.isAuthenticated = true;
//     if(!session.account){
//         session.account = {};
//     }
//     session.account.name = newName;
//     session.account.username = newName;
//     console.log("set session");
//     res.redirect("/api/v3/getIdentity");
// });

// // use this by going to a url like: 
// // http://localhost:3000/fakelogout
// app.get('/fakelogout', (req, res) => {
//     let newName = req.query.name;
//     let session=req.session;
//     session.isAuthenticated = false;
//     session.account = {};
//     console.log("you have fake logged out");
//     res.redirect("/api/v3/getIdentity");
// });
export default app;
