import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';







const app = express(); 
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
// console.log(__dirname);           // /Users/injalthapa/Downloads/Chatterly/backend


// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


// make ready for deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}


app.use('*', (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});





app.listen(PORT, () => {
    console.log("Server is running on Port:", PORT);
})