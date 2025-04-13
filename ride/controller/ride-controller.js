import { Ride } from "../models/route-model.js";
import { publishToQueue } from "../service/rabbit-broker.js";
import ErrorHandler from "../utils/utility.js";

const createRide = async (req, res, next) => {
    try {
        const { pickup, destination } = req.body;

        if (!pickup || !destination)  return next(new ErrorHandler('Pickup and destination are required!',400))

        if(!req.user.user) return next(new ErrorHandler('Unauthorized!',401))

        const newRide = await Ride.create({
            user: req.user.user._id,
            pickup,
            destination,
        });

        // Publish the ride details to RabbitMQ
        await publishToQueue('new-ride', JSON.stringify(newRide));
        
        console.log('Ride published to queue successfully.');


        res.status(201).json({
            message: 'Initiating your ride...',
            ride: newRide, 
        });
    } catch (error) {
        console.error('Error creating ride:', error.message);
        next(error); // Pass the error to the global error handler
    }
};

const acceptRide = async(req,res,next)=>{
    const rideId = req.query.rideId
    console.log(rideId)
    console.log(typeof(rideId))
    
    try{
        const ride = await Ride.findById(rideId)
        console.log("Ride",ride)
        if(!ride) return next(new ErrorHandler('Ride not found!',400))
    
        ride.status="accepted";

        await ride.save()

        await publishToQueue("accepted-ride",JSON.stringify(ride))
        res.send(ride)

    }catch(err){
        res.json({
            success:false,
            message:err
        })
    }

    
}


export {
    createRide,
    acceptRide
}