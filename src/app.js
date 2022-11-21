import express, {json} from "express";
import cors from "cors"
import authRouter from "./routes/auth.Router.js"
import registerRouter from "./routes/register.Router.js"
import { collectionSessao } from "./database/db.js";

const app = express();
app.use(cors());
app.use(json());
app.use(authRouter);
app.use(registerRouter);

setInterval(async() => {
    try{
        const sessoes = await collectionSessao.find().toArray();
        const sessoesInativas = sessoes.filter(s =>  Date.now() - s.lastStatus > 10000);

        sessoesInativas.map(async(s) => {
            await collectionSessao.deleteOne({userId: s.userId})
        })


    } catch(err){
        console.log(err);
    }
}, 10000);

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running in port: ${port}`));