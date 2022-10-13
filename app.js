import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


import apiv1Router from './routes/api/v1/apiv1.js'; // load apiv1 router

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
app.use(express.static(path.join(__dirname, 'public'))); //static server: copy file and send it back. host static file and send it back requested
// if can't find file from the static, it will go down to search files,
// in this case, if server doesn't find file from static server, it will go to user router

app.use('/api/v1/', apiv1Router)

export default app;
