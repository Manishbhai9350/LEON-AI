import mongoose from 'mongoose';


const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        min:[6,'Email must be at least 6 characters'],
        max:[50,'Email must be less then 6 characters'],
    },
    password:{
        type:String,
        required:true,
        min:[8,'Password must be at least 8 characters'],
        max:[20,'Password must be less then 20 characters'],
        select:false
    },
    projects:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project'
        }
    ]
})



export const UserModel = mongoose.model('User',UserSchema)
