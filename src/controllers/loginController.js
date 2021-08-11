import connection from "../database.js";
import { SubscribeSchema } from "../schemas/SubscribeSchema.js";
import { LoginSchema } from "../schemas/LoginSchema.js";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
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

		const response = await connection.query(`
            SELECT * FROM users WHERE email = $1
        `,[email]);

		if (response.rows.length === 0) return res.sendStatus(404);
        
		const user = response.rows[0];

		if(bcrypt.compareSync(password, user?.password)) {
			const token = uuid();

			await connection.query(`
                DELETE FROM sessions WHERE "userEmail" = $1
            `, [user.email]);

			await connection.query(`
                INSERT INTO sessions ("userEmail", token) VALUES ($1, $2)
            `, [user.email, token]);
			res.status(200).send(token);
		} else {
			res.sendStatus(401);
		}
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
}
