import { ObjectId } from "mongodb";
import { collectionRegistro } from "../database/db.js";
import { registroSchema, atualizarRegistroSchema } from "../schemas/register.Schemas.js";


export async function postRegistro(req, res){
    const dadosRecebidos = req.body;
    const {date, title, value} = dadosRecebidos;
    const sessaoExistente = req.sessaoExistente

    try{
        const {error} = registroSchema.validate(dadosRecebidos, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(422).send(erros);
            return
        };

        const novoRegistro = {
            userId: sessaoExistente.userId,
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
    const sessaoExistente = req.sessaoExistente

    try{
        const registros = await collectionRegistro.find({userId: sessaoExistente.userId}).toArray();
        
        res.status(200).send(registros);

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function deleteRegistro(req, res){
    const registro = req.registro;

    try{
        await collectionRegistro.deleteOne(registro);
        res.status(200).send("Deletado com sucesso!");

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function putRegistro(req, res){
    const registro = req.registro;
    const dadosRecebidos = req.body;
    const {value, title} = dadosRecebidos;

    try{
        const {error} = atualizarRegistroSchema.validate(dadosRecebidos, {abortEarly: false});

        if(error){
            const erros = error.details.map(d => d.message);
            res.status(422).send(erros);
            return
        }

        const registroAtualizado = {...registro, title:title, value:value}


        await collectionRegistro.updateOne({_id: ObjectId(id)},{$set: registroAtualizado})
        
        res.status(201).send("Atualizado com sucesso!");

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}