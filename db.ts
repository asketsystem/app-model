import mongoose from "mongoose";
import { config } from "./src/config";
import { logger } from "./src/logger";

export async function connectToDb(){
    try{
        await mongoose.connect(config.DATABASE_URL);
        logger.info("Connected to database")
    }catch(e){
        logger.error(e)

        process.exit(1);
    }
}

export function disconnectFromDb(){
    return mongoose.connection.close();
}