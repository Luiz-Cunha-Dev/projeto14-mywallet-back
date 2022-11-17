import express, {json} from "express";
import cors from "cors"
import joi from "joi";
import {MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { signUp, signIn } from "./controllers/authController.js";



const cadastroSchema = joi.object({
name:joi.string().required().min(3).max(15),
email:joi.string().email().required(),
password:joi.string().required().min(3).max(20)
})

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




app.listen(5000, () => console.log("Server running in port: 5000"));