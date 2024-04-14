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
import sensorRoutes from './routes/sensor.route.js';
import logRoutes from './routes/log.route.js';
import alertRoutes from './routes/alert.route.js';
import institutionRoutes from './routes/institution.route.js';

// use routes

app.use('/api/v1/images', imageUpload);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/sensors', sensorRoutes);
app.use('/api/v1/logs', logRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/institutions', institutionRoutes);

export { app };