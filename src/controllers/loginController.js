import { SignUpSchema } from "../schemas/SignUpSchema.js";
import { SignInChema } from "../schemas/SignInChema.js";
import * as loginService from "../services/loginService.js";

export async function signUp(req, res) {
	try {
		const {name, email, password} = req.body;
		console.log({name, email, password});
		const errors = SignUpSchema.validate(req.body).error;
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
		const errors = SignInChema.validate(req.body).error;
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

export async function signOut(req, res) {
	try {
		const user = res.locals.user;
		await loginService.signOut(user);
		res.sendStatus(200);
	} catch(err) {
		res.status(500).send(err);
	}
}