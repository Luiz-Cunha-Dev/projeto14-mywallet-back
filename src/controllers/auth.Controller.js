import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { collectionUsuario, collectionSessao } from "../database/db.js";
import joi from "joi";
import { ObjectId } from "mongodb";

const cadastroSchema = joi.object({
    name:joi.string().required().min(3).max(15),
    email:joi.string().email().required(),
    password:joi.string().required().min(3).max(20)
    })


export async function signUp(req, res){
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
            return
        }

        const senhaEncriptada= bcrypt.hashSync(user.password, 10);

        await collectionUsuario.insertOne({...user, password: senhaEncriptada});

        res.sendStatus(201);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function signIn(req, res){
    const {email, password} = req.body;

    try{
        const usuario =  await collectionUsuario.findOne({email});

        const sessaoExistente = await collectionSessao.findOne({userId: usuario._id});

        if(sessaoExistente){
            res.status(409).send("Usuario ja logado!")
            return
        }

        if(usuario && bcrypt.compareSync(password, usuario.password) ){
            const token = uuid();

            await collectionSessao.insertOne({
                userId: usuario._id,
                token,
                lastStatus: Date.now()
            });

            res.send(token);
        }else if(!usuario){
            res.status(400).send("Email não cadastrado!");
        }else{
            res.status(401).send("Senha incorreta!");
        }

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function postStatus(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer", "");

    try{
        const sessaoExistente = await collectionSessao.findOne({token});

        if(!sessaoExistente){
            res.sendStatus(404);
        }

        const sessaoAtualizada = {... sessaoExistente, lastStatus: Date.now()};

        await collectionSessao.updateOne({token},{ $set: sessaoAtualizada });

        res.sendStatus(200);

    } catch(err){
        res.status(500);
        console.log(err);
    }
}
