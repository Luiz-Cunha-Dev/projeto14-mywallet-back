import express, {json} from "express";
import cors from "cors"
import joi from "joi";
import {MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt"

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

app.post("/sign-up", async(req,res) => {
    const user = req.body;


    try{
        const usuarioExistente = await collectionUsuario.findOne({email: user.email});
        if(usuarioExistente){
            res.status(409).send("Email ja cadastrado!")
            return
        }

        const {error} = cadastroSchema.validate(user, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(422).send(erros);
        }

        const senhaEncriptada= bcrypt.hashSync(user.password, 10);

        await collectionUsuario.insertOne({...user, password: senhaEncriptada});

        res.sendStatus(201);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})


app.listen(5000, () => console.log("Server running in port: 5000"));