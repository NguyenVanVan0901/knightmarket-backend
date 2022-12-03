
import mongoose from 'mongoose';
interface ConnectedDB {
    database: any
}
const stringConnect = process.env.NODE_ENV ==='production' ? process.env.STRING_CONNECT_MONGODB : process.env.STRING_CONNECT_MONGODB_LOCAl
const objConnectDB: ConnectedDB = {} as ConnectedDB ;

async function connectDatabase(dbName: string){
    try {
        objConnectDB.database = await  mongoose.connect(`${stringConnect}/${dbName}?retryWrites=true&w=majority`);
        console.log(`Connected MongoDB Successfully! DatabaseName => "${dbName}"`);
    } catch (error) {
        console.log(`Connected MongoDB failue! DatabaseName => "${dbName}"`);
        console.log(error);
    }
}
export { connectDatabase , objConnectDB };