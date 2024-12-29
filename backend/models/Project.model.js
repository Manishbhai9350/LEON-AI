import mongoose from 'mongoose';



const ProjectSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Project name must be provided'],
        unique:true,
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

export const ProjectModel = mongoose.model("Project",ProjectSchema)