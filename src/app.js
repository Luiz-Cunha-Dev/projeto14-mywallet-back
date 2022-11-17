import express, {json} from "express";
import cors from "cors"
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import { signUp, signIn, postStatus } from "./controllers/authController.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());
let db;
export let collectionUsuario;
export let collectionRegistro;
export let collectionSessao;

try{
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db("myWallet");
    collectionUsuario = db.collection("usuario");
    collectionRegistro = db.collection("registro");
    collectionSessao = db.collection("sessao");
} catch(err){
    console.log(err);
}

app.post("/sign-up", signUp);

app.post("/sign-in", signIn);

app.post("/status", postStatus);


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


app.listen(5000, () => console.log("Server running in port: 5000"));