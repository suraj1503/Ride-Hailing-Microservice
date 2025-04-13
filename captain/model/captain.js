import mongoose, { model,Schema }  from "mongoose";
import {hash} from 'bcrypt'

const captainSchema = new Schema({
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
    },
    isAvailable:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

captainSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await hash(this.password,10)
})


export const Captain = mongoose.models.Captain || model("Captain",captainSchema)