import { configDotenv } from 'dotenv';
import Redis from 'ioredis';
configDotenv()


const RedisOptions = {
    host:process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
}

console.log(RedisOptions)


const RedisCLI = new Redis(RedisOptions)

RedisCLI.on('connect',() => {
    console.log('Connected to Redis');
})
RedisCLI.on('error',err => {
    console.log('Error While Connecting To Redis')
    if(process.env.ENV == 'dev'){
        console.log(err)
    }
})

export default RedisCLI