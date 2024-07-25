import mongoose from 'mongoose';
import { Server } from 'socket.io';

export const sensorWatcher = (io: Server) => {
    const sensorsCollection = mongoose.connection.collection('sensordatas');

    if (!sensorsCollection) {
        console.error("Sensors collection not found");
        return;
    }

    const changeStream = sensorsCollection.watch();

    changeStream.on('change', (change: any) => {
        if (change.operationType === 'insert') {
            const document = change.fullDocument;
            console.log('New document added in sensors data:', document);
            io.emit('sensorData', document); // Emit the event to all connected clients
        }
    });

    changeStream.on('error', (error: Error) => {
        console.error('Error with change stream:', error);
    });
};
