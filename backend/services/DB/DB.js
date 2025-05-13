import mongoose from 'mongoose';


export async function CONNECT(){
    try {
        if(process.env.ENV == 'dev'){
        
            console.log(process.env.MONGODB_URL)
        }
        await mongoose.connect(process.env.MONGODB_URL)
        // console.clear()
        console.log('CONNECTED TO DB')
    } catch (error) {
        if(process.env.ENV == 'dev'){
        
            console.log(error)
        }
        console.log('FAILED TO CONNECT TO DB')
    }
}