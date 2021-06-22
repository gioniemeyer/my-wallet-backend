import joi from 'joi';

const LoginSchema = joi.object({
    email: joi.string().required(),    
    password: joi.string().required()
});

export { LoginSchema };