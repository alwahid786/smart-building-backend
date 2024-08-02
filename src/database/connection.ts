import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { sensorWatcher } from '../utils/watchSensorData.js';

export const connectDB = async (dbUrl: string, io: Server) => { // Add io parameter
    try {
        mongoose.connection.on('connected', () => console.log('Connected to database successfully'));
        mongoose.connection.on('error', (err) => console.log('Error in connection to database:', err));

        await mongoose.connect(dbUrl);
        sensorWatcher(io); // Call sensorWatcher with io
    } catch (error) {
        console.log('Connection failed:');
        process.exit(1);
    }
};
