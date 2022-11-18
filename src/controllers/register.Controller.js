import { ObjectId } from "mongodb";
import { collectionRegistro, collectionSessao } from "../database/db.js";
import joi from "joi";

const registroSchema = joi.object({
    date:joi.string().required().min(5).max(5),
    title:joi.string().required().min(1).max(20),
    value:joi.number().required().min(1).max(8)
    })

const atualizarRegistroSchema = joi.object({
    title:joi.string().required().min(1).max(20),
    value:joi.number().required().min(1).max(8)
})


export async function postRegistro(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "");
    const registroRecebido = req.body;
    const {date, title, value} = registroRecebido;

    if(!token){
        res.status(400).send("Token não informado!");
        return;
    }

    try{
        const {error} = registroSchema.validate(registroRecebido, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(422).send(erros);
            return
        }

        const sessao = await collectionSessao.findOne({token});

        if(!sessao){
            res.status(404).send("Sessão não encontrada!");
            return;
        }

        const novoRegistro = {
            userId: sessao.userId,
            date,
            title,
            value
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

export async function putRegistro(req, res){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "");
    const {id} = req.params;
    const registroRecebido = req.body;
    const {value, title} = registroRecebido;

    if(!token){
        res.status(400).send("Token não informado!");
        return;
    }

    if(!id){
        res.status(400).send("Id não informado!");
        return;
    }

    try{
        const {error} = atualizarRegistroSchema.validate(registroRecebido, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(422).send(erros);
            return
        }

        const sessao = await collectionSessao.findOne({token});

        if(!sessao){
            res.status(404).send("Sessão não encontrada");
            return;
        }

        const registro = await collectionRegistro.findOne({_id: ObjectId(id)});

        const registroAtualizado = {...registro, title:title, value:value}


        await collectionRegistro.updateOne({_id: ObjectId(id)},{$set: registroAtualizado})
        
        res.status(201).send("Atualizado com sucesso!");

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}