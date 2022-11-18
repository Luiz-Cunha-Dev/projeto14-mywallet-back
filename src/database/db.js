import {MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export let collectionUsuario;
export let collectionRegistro;
export let collectionSessao;

try{
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db("myWallet");
    collectionUsuario = db.collection("usuario");
    collectionRegistro = db.collection("registro");
    collectionSessao = db.collection("sessao");
} catch(err){
    console.log(err);
}