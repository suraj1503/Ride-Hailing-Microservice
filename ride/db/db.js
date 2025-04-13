import mongoose from "mongoose";

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{dbName:'Ride'})
    .then((data)=>{
        console.log(`Connected to DB:${data.connection.host}`)
    }).catch((err)=>{
        console.log(err)
    })
} 

export {
    connectDB
}