// const mongoose = require('mongoose');
import mongoose from 'mongoose';
interface ConnectedDB {
    database: any
}
const objConnectDB: ConnectedDB = {} as ConnectedDB ;
async function connectDatabase(dbName){
    try {
        objConnectDB.database = await  mongoose.connect(`mongodb+srv://nguyenvanvan-yone:QyHucO45aM2QJrWQ@cluster0.buxjv.mongodb.net/${dbName}?retryWrites=true&w=majority`);
        console.log(`Connected MongoDB Successfully!  DatabaseName => "${dbName}"`);
    } catch (error) {
        console.log(`Connected MongoDB failue!  DatabaseName => "${dbName}"`);
        console.log(error);
    }
}
export { connectDatabase , objConnectDB };