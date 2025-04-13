import mongoose, { model,Schema }  from "mongoose";
import {hash} from 'bcrypt'

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return next()
    this.password=await hash(this.password,10)
})


export const User = mongoose.models.User || model("User",userSchema)