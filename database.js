const mongoose = require('mongoose')

// main()
//since main doesnot return anything then block will execute always 

const mongo_url = process.env.ATLASDB_URL
async function main(){
    try {
//    await mongoose.connect('mongodb://127.0.0.1:27017/TravaNest');
        await mongoose.connect(mongo_url);
        console.log("database  connected ")
    } catch (error) {
       throw new Error("Database connection error" + error.message)
    }
}

module.exports = {main}
