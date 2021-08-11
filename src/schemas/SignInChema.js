import joi from "joi";

const SignInChema = joi.object({
	email: joi.string().required(),    
	password: joi.string().required()
});

export { SignInChema };