import joi from "joi";

export const registroSchema = joi.object({
    date:joi.string().required().min(5).max(5),
    title:joi.string().required().min(1).max(20),
    value:joi.number().required()
    })

export const atualizarRegistroSchema = joi.object({
    title:joi.string().required().min(1).max(20),
    value:joi.number().required()
})