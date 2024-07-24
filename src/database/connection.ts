import mongoose from 'mongoose';
import { sensorWatcher } from '../utils/watchSensorData.js';

export const connectDB = async (dbUrl: string) => {
    try {
        mongoose.connection.on('connected', () => console.log('Connected to database successfully'));
        mongoose.connection.on('error', (err) => console.log('Error in connection to database:', err));

        await mongoose.connect(dbUrl);
        await sensorWatcher();
    } catch (error) {
        console.log('Connection failed:', error);
        process.exit(1);
    }
};
