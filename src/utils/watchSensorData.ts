import mongoose from "mongoose";

const sensorWatcher = () => {
  const sensorsCollection = mongoose.connection.collection("sensordatas");
  const changeStream = sensorsCollection.watch();
  changeStream.on("change", async (change: any) => {
    if (change.operationType === "insert") {
      const document = change.fullDocument;
      console.log("new document added in sesnors data", document);
    }
  });
};

export { sensorWatcher };