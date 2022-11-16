import express, {json} from "express";
import cors from "cors"
import Joi from "joi";
import {MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
app.use(json());
let db;
let collectionUsuario;
let collectionRegistro;

try{
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db("myWallet");
    collectionUsuario = db.collection("usuario");
    collectionRegistro = db.collection("registro");
} catch(err){
    console.log(err);
}



app.listen(5000, () => console.log("Server running in port: 5000");)