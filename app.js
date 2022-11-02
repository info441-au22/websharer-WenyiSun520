import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import msIdExpress from 'microsoft-identity-express';
const appSettings = {
  appCredenticals: {
    clientId: "8c15ea7e-f9f6-4552-b3a1-fff19c5c024f",
    tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "5IF8Q~i0G_c8Kfth4WVv_z-vX3XF_9Qtxv0jWa~L",
  },
  authRoutes: {
    redirect: "https://wenyis.tech/redirect",
    error: "/error",
    unauthorized:"/unauthorized"
  },
};


import apiv2Router from './routes/api/v2/apiv2.js'; // load apiv2 router
import models from './models.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
// middleware:
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use((req,res,next)=>{
    req.models = models;
    next();

})
const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize());
app.get('/signin', msid.signIn({postLoginRedirect:'/'}));
app.get('/signout', msid.signOut({postLogoutRedirect: '/'}));
app.get('/error', (req, res)=>{
    res.status(500).send("Error: Server error")
})
app.get("/unauthorized", (req, res) => {
  res.status(401).send("Error: Unauthorized");
});
app.use('/api/v2/', apiv2Router);

export default app;
