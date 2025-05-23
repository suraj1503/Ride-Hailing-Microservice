import mongoose from "mongoose";

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{dbName:'User'})
    .then((data)=>{
        console.log(`Connected to DB:${data.connection.host}`)
    }).catch((err)=>{
        console.log(err)
    })
} 

export {
    connectDB
}
