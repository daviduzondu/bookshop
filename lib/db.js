const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const password = "gDNvvT00YgAQ00IM";

async function connectToDB() {
    try {
        return await MongoClient.connect(`mongodb+srv://daviduzondu:${password}@cluster0.usbmnfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    } catch (e) {
        console.log("Error:", e.message);
    }
}

module.exports = connectToDB;