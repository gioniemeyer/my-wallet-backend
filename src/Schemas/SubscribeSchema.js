import joi from 'joi';

const SubscribeSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),    
    password: joi.string().required()
});

export { SubscribeSchema };