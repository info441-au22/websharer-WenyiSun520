import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


import apiv2Router from './routes/api/v2/apiv2.js'; // load apiv2 router

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

app.use('/api/v2/', apiv2Router);

export default app;
