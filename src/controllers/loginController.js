import { SubscribeSchema } from "../schemas/SubscribeSchema.js";
import { LoginSchema } from "../schemas/LoginSchema.js";
import * as loginService from "../services/loginService.js";

export async function signUp(req, res) {
	try {
		const {name, email, password} = req.body;
		const errors = SubscribeSchema.validate(req.body).error;
		if(errors) return res.sendStatus(400);
        
		const response = await loginService.signUp(name, email, password);

		if(!response) return res.sendStatus(409);
		res.sendStatus(201);
	} catch(err) {
		res.status(500).send(err);
	}
}

export async function signIn(req, res) {
	try {
		const {email, password} = req.body;
		const errors = LoginSchema.validate(req.body).error;
		if(errors) return res.sendStatus(400);

		const validUser = await loginService.checkUserByEmail(email);
		if(!validUser) return res.sendStatus(404);

		const token = await loginService.signIn(validUser, password);

		if(token) return res.status(200).send(token);
		res.sendStatus(401);
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
}
