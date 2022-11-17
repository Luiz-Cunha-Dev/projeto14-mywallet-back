import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { collectionUsuario, collectionSessao } from "../app.js";


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

