 import { collectionSessao } from "../database/db.js";

 export default async function verificaToken(req, res, next){
    const {authorization} = req.headers;
    const token = authorization.replace("Bearer ", "");

    if(!token){
        res.status(400).send("Token não informado!");
        return;
    }

    try{
        const sessaoExistente = await collectionSessao.findOne({token});

        if(!sessaoExistente){
            res.sendStatus(404);
            return
        }

        req.token = token;
        req.sessaoExistente = sessaoExistente;
        
    }catch(err){
        res.status(500);
        console.log(err);
    }

    next();
};