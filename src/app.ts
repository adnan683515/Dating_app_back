
import  express  from 'express';
import cors from 'cors'
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/global.error.handler';
import http from 'http'
import { initSocket } from './app/socket/socket.server';

const app = express()
const server = http.createServer(app)

initSocket(server)


app.use(express.json())// body theke data accepte korar jonno
app.use(cors()) // frontend theke jno api gula access korte pare
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", router) 


// global error
app.use(globalErrorHandler)




export default app