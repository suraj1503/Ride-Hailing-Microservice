import express from 'express'
import expressProxy from 'express-http-proxy'

const app = express();


app.use('/user',expressProxy('http://localhost:3001'))
app.use('/captain',expressProxy('http://localhost:3002'))
app.use('/ride',expressProxy('http://localhost:3003'))

app.listen(3000,()=>{
    console.log(`Gateway server is running on Port: 3000`)
})