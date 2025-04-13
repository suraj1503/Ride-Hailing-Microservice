# Ride-Hailing Microservice Backend 🚗🛠️

This project simulates a ride-hailing workflow backend using a **microservices architecture**. It focuses on **real-time communication**, **event-driven architecture**, and **API gateway design** using **Express Proxy** to route requests between services.

## Project Overview 💬

The backend simulates a ride-hailing system where users can create rides, captains can accept them, and real-time communication is facilitated through an **API Gateway** and **RabbitMQ**.

### Core Services:
1. **User Service**: Manages user-related activities like creating and viewing rides.
2. **Ride Service**: Handles ride creation and acceptance logic.
3. **Captain Service**: Handles the captain's task of polling and accepting available rides.
4. **API Gateway**: Built using **Express Proxy**, it routes requests to the appropriate service.

### How It Works:
- **User** creates a ride via `/create-ride` endpoint.
- **Captain** keeps polling for new rides via `/new-ride`.
- Once a ride is available, **Captain** can accept it via `/accept-ride`.
- The **User** can then view the accepted ride.

---

## Architecture 📦

### Microservices Design:
- Each service has its own database (MongoDB), ensuring data isolation and better scalability.
- Services communicate with each other via **RabbitMQ** for event-driven messaging.
- An **Express Proxy** is used as the API Gateway to route client requests to the relevant service.

### Tech Stack:
- **Node.js**: JavaScript runtime for building the backend services.
- **Express.js**: Web framework used for creating RESTful APIs.
- **Express Proxy**: API Gateway to route requests between microservices.
- **RabbitMQ**: Message broker used for event-driven communication between services.
- **MongoDB**: Database used for each service to store and manage data.

### Key Concepts:
- **Decoupled Microservices**: Each service is independent and can evolve separately.
- **Event-Driven Architecture**: Services communicate via events, ensuring loose coupling.
- **Polling**: Captains poll for available rides until one is accepted.
- **API Gateway Design**: The API Gateway routes all incoming requests to the appropriate service.

---

## Setup Instructions 🛠️

Follow these steps to get the project up and running on your local machine:

### Prerequisites:
- **Node.js** (v14+)
- **RabbitMQ** running on your local machine or on a cloud server.
- **MongoDB** (locally or using MongoDB Atlas).

### Clone the Repo:

```bash
git clone https://github.com/suraj1503/Ride-Hailing-Microservice.git
cd Ride-Hailing-Microservice
