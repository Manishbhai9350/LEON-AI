import mongoose from 'mongoose';


export async function CONNECT(){
    try {
        console.log(process.env.MONGODB_URL)
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('CONNECTED TO DB')
    } catch (error) {
        console.log(error)
        console.log('FAILED TO CONNECT TO DB')
    }
}