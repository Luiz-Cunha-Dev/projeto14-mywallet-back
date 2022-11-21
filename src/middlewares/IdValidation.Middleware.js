import { collectionRegistro } from "../database/db.js";
import { ObjectId } from "mongodb";

export default async function verificaId(req, res, next){
    const {id} = req.params;

    if(!id){
        res.status(400).send("Id não informado!");
        return;
    }

    const registro = await collectionRegistro.findOne({_id: ObjectId(id)});

    if(!registro){
        console.log(registro)
        res.status(404).send("Registro não encontrado")
        return
    }

   req.registro = registro;
   req.id = id

    next();
}