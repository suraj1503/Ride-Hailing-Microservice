import http from 'http'
import app from './app.js'

const server = http.createServer(app);
const PORT=process.env.PORT

server.listen(3003,()=>{
    console.log(`Listening to port ${PORT}`)
})