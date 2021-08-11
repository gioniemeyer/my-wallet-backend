import joi from "joi";

const SignUpSchema = joi.object({
	name: joi.string().required(),
	email: joi.string().required(),    
	password: joi.string().required()
});

export { SignUpSchema };