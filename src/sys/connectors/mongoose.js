const mongoose = require("mongoose");
const { DB_HOST, DB_PORT, DB_NAME } = process.env;
let count = 0;

const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  //geting rid off the depreciation errors
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  mongoose
    .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, options)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(
        "MongoDB connection unsuccessful, retry after 5 seconds. ",
        ++count
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

module.exports = mongoose;
