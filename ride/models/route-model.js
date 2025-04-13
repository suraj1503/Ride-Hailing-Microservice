import mongoose, { Schema, Types,model } from "mongoose";


const rideSchema = new Schema({
    captain: {
        type: Types.ObjectId,
        // ref:"User"
    },
    user: {
        type: Types.ObjectId,
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [ 'requested', 'accepted', 'started', 'completed' ],
        default: 'requested'
    },
})

export const Ride = mongoose.models.Ride || model("Ride",rideSchema)