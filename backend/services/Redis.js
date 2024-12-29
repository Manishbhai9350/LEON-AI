import { configDotenv } from 'dotenv';
import Redis from 'ioredis';
configDotenv()


const RedisCLI = new Redis({
    host:process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
})

RedisCLI.on('connect',() => {
    console.log('Connected to Redis');
})
RedisCLI.on('error',err => {
    console.log('Error While Connecting To Redis')
    console.log(err)
})

export default RedisCLI