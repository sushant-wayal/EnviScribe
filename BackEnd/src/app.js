import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:  process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieParser());

// import routes

import userRoutes from './routes/user.routes.js';
import imageUpload from './routes/image.route.js';
import deviceRoutes from './routes/device.route.js';

// use routes

app.use('/api/v1/images', imageUpload);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/devices', deviceRoutes);

export { app };