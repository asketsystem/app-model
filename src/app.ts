import { connectToDb, disconnectFromDb } from '../db';
import { config } from './config';
import { logger } from './logger';
import { createServer } from './utils/createServer';

const signals = ["SIGINT", "SIGTERM", "SIGHUP"];

async function gracefulShutdown({
    signal,
    server
}:{
    signal: typeof signals[number]
    server: Awaited<ReturnType<typeof createServer>>
}){
    logger.info(`Got signal ${signal}. Good bye!`)
    await server.close();

    await disconnectFromDb()

    process.exit(0);
}

async function startServer(){
    const server = await createServer()

    server.listen({
        port: config.PORT,
        host: config.HOST
    })
    
    await connectToDb()

    logger.info(`App is Listening`)

    for (let i = 0; i < signals.length; i++) {
        process.on(signals[i], () =>
            gracefulShutdown({
                signal: signals[i],
                server,
            })
        )
    } 
}

startServer()