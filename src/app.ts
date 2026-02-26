
import  express  from 'express';
import cors from 'cors'
import { router } from './app/routes';


const app = express()


app.use(express.json())// body theke data accepte korar jonno
app.use(cors()) // frontend theke jno api gula access korte pare


app.use("/api/v1", router) 





export default app