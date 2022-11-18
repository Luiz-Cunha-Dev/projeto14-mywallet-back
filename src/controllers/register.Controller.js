import { ObjectId } from "mongodb";
import { collectionRegistro, collectionSessao } from "../database/db.js";

export async function postRegistro(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "");
    const {date, title, valor} = req.body;

    if(!token){
        res.status(400).send("Token não informado!");
        return;
    }

    try{
        const sessao = await collectionSessao.findOne({token});

        if(!sessao){
            res.status(404).send("Sessão não encontrada!");
            return;
        }

        const novoRegistro = {
            userId: sessao.userId,
            date,
            title,
            valor
        };

        await collectionRegistro.insertOne(novoRegistro);

        res.sendStatus(201);

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getRegistro(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "");

    if(!token){
        res.status(400).send("Token não informado!");
        return;
    }

    try{
        const sessao = await collectionSessao.findOne({token});

        if(!sessao){
            res.status(404).send("Sessão não encontrada");
            return;
        }

        const registros = await collectionRegistro.find({userId: sessao.userId}).toArray();
        
        res.status(200).send(registros);

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function deleteRegistro(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "");
    const {id} = req.params;

    if(!token){
        res.status(400).send("Token não informado!");
        return;
    }

    if(!id){
        res.status(400).send("Id não informado!");
        return;
    }

    try{
        const sessao = await collectionSessao.findOne({token});

        if(!sessao){
            res.status(404).send("Sessão não encontrada");
            return;
        }

        const registro = await collectionRegistro.findOne({_id: ObjectId(id)})

        if(!registro){
            console.log(registro)
            res.status(404).send("Registro não encontrado")
            return
        }

        await collectionRegistro.deleteOne(registro);
        res.status(200).send("Deletado com sucesso!");

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

