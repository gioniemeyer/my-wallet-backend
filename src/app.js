import express from "express";
import cors from "cors";
import connection from "./database.js";

import * as loginController from "./controllers/loginController.js";
import * as authMiddleware from "./middlewares/authMiddleware.js";
import * as userController from "./controllers/userController.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/subscribe", loginController.signUp);

app.post("/sign-in", loginController.signIn);

app.get("/home", authMiddleware.validateToken, userController.sendUserInfos);

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

app.post("/new-expense", authMiddleware.validateToken, userController.newExpense);

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

export default app;