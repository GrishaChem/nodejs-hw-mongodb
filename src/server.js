import express from "express";
import pinoHttp from 'pino-http';
import cors from 'cors';  
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const logger = pinoHttp();

app.use(logger)

app.use(cors());

console.log(process.env.PORT);

app.use((req, res, next) => {
    res.status(404).send({message: 'Not found'})
})

export const setUpServer = () => {
    
    const PORT = process.env.PORT;

    app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

}

setUpServer();

