import joi from 'joi';

const UserSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),    
    password: joi.string().required()
});

export { UserSchema };