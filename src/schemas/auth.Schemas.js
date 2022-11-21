import joi from "joi";


export const cadastroSchema = joi.object({
    name:joi.string().required().min(3).max(15),
    email:joi.string().email().required(),
    password:joi.string().required().min(3).max(20)
    });