import * as userService from "../services/userService.js";

export async function sendUserInfos(req, res) {
	try {
		const user = res.locals.user;

		const userInfos = await userService.userInfos(user);
    
		if(userInfos) {
			res.status(200).send(userInfos);
		} else {
			res.sendStatus(401);
		}
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
}

export async function userExpense(req, res) {
	try {
		const {value, description} = req.body;
		const email = res.locals.user.email;

		if(!value || description?.length === 0) {
			return res.sendStatus(400);
		}

		await userService.addExpense(value, description, email);
		res.sendStatus(201);
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
}

export async function userEntry(req, res) {
	try {
		const {value, description} = req.body;
		const email = res.locals.user.email;

		if(!value || description?.length === 0) {
			return res.sendStatus(400);
		}

		await userService.addEntry(value, description, email);
		res.sendStatus(201);
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
}