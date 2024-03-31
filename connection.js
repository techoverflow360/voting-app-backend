const mongoose = require('mongoose');

function connectToDatabase(MongoURL) {
    return mongoose.connect(MongoURL);
}

module.exports = {
    connectToDatabase,
}