import express from "express";
import cors from "cors";
import connection from "./database.js";

import * as loginController from "./controllers/loginController.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/subscribe", loginController.signUp);

app.post("/sign-in", loginController.signIn);

app.get("/home", async (req, res) => {
	const authorization = req.headers["authorization"];

	const token = authorization?.replace("Bearer ","");

	const result = await connection.query(`
        SELECT users.*, sessions.token
        FROM sessions
        JOIN users
        ON users.email = sessions."userEmail"
        WHERE token = $1
    `, [token]);

	const user = result.rows[0];

	if(user) {
		delete user?.password;
		res.status(200).send(user);
	} else {
		res.sendStatus(401);
	}
});

app.get("/register", async (req, res) => {
	const authorization = req.headers["authorization"];
	const token = authorization.replace("Bearer ", "");

	const response = await connection.query(`
        SELECT transactions.* 
        FROM transactions
        JOIN sessions
        ON sessions."userEmail" = transactions."userEmail"
        WHERE sessions.token = $1
    `, [token]);

	res.status(200).send(response.rows);
});

app.post("/new-entry", async (req, res) => {
	try {
		const authorization = req.headers["authorization"];
		const token = authorization?.replace("Bearer ", "");

		const {value, description} = req.body;

		if(!value || description?.length === 0) {
			return res.sendStatus(400);
		}

		const valueInteger = value?.replace(".", "");

		const response = await connection.query(`
            SELECT * from sessions WHERE token = $1
        `,[token]);

		const session = response.rows[0];

		await connection.query(`
            INSERT INTO transactions (date, description, value, "userEmail") 
            VALUES (NOW(), $1, $2, $3)
        `, [description, valueInteger, session.userEmail]);

		res.sendStatus(201);
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.post("/new-expense", async (req, res) => {
	try {
		const authorization = req.headers["authorization"];
		const token = authorization?.replace("Bearer ", "");

		const {value, description} = req.body;

		if(!value || description?.length === 0) {
			return res.sendStatus(400);
		}

		let valueInteger = value?.replace(".", "");

		if(valueInteger) valueInteger = valueInteger*(-1); 

		const response = await connection.query(`
            SELECT * from sessions WHERE token = $1
        `,[token]);

		const session = response.rows[0];

		await connection.query(`
            INSERT INTO transactions (date, description, value, "userEmail") 
            VALUES (NOW(), $1, $2, $3)
        `, [description, valueInteger, session.userEmail]);

		res.sendStatus(201);
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.get("/sign-out", async (req, res) => {
	try {
		const authorization = req.headers["authorization"];
		const token = authorization?.replace("Bearer ", "");
    
		await connection.query(`
            DELETE FROM sessions WHERE "token" = $1
        `, [token]);

		res.sendStatus(200);
	} catch(err) {
		res.status(500).send(err);
	}
});

app.get("/test", (req, res) => {
	res.sendStatus(200);
});


export default app;