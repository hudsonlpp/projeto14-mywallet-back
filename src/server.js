import express, { json } from 'express';
import cors from 'cors'
import authRoute from "./routes.js";
import transactionRoute from "./routes.js";

const PORT = 5000;
const server = express();
server.use(express.json());
server.use(cors());
server.use([authRoute, transactionRoute]);



server.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});

export default server;
