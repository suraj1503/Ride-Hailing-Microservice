import amqp from 'amqplib'

let connection, channel;

async function connectRBMQ() {
    try {
        const RABBITMQ_URL = process.env.RABBIT_URL;
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw new Error("RabbitMQ connection failed");
    }
}

async function subscribeToQueue(queueName, callback) {
    console.log(queueName,"user")
    try {
        if (!channel) await connectRBMQ();
        await channel.assertQueue(queueName, { durable: true }); // Ensure the queue is durable
        console.log(`Subscribed to queue: ${queueName}`);

        channel.consume(queueName, (message) => {

            if (message !== null) {
                console.log(`Received message from ${queueName}:`, message.content.toString());
                callback(message.content.toString());
                channel.ack(message);
            } else {
                console.warn(`Null message received from queue: ${queueName}`);
            }
        });
    } catch (error) {
        console.error(`Failed to subscribe to queue ${queueName}:`, error);
    }
}


async function publishToQueue(queueName, data) {
    try {
        if (!channel) await connectRBMQ();
        await channel.assertQueue(queueName, { durable: true });

        console.log(`Publishing to queue: ${queueName}`);
        console.log(`Data being sent: ${data}`);

        channel.sendToQueue(queueName, Buffer.from(data));

        console.log(`Message successfully sent to queue: ${queueName}`);
    } catch (error) {
        console.error('Error while publishing message:', error);
    }
}



export {
    subscribeToQueue,
    publishToQueue,
    connectRBMQ,
};