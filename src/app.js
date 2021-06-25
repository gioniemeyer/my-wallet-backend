import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid';
import connection from "./database.js";
import {SubscribeSchema} from './Schemas/SubscribeSchema.js';
import {LoginSchema} from './Schemas/LoginSchema.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/subscribe', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const errors = SubscribeSchema.validate(req.body).error;

        if(errors) return res.sendStatus(400);
        
        const hash = bcrypt.hashSync(password, 10);

        const response = await connection.query(`
            SELECT * FROM users WHERE email = $1
        `,[email]);


        if (response.rows.length > 0) return res.sendStatus(409);

        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3)
        `, [name, email, hash]);

        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.post("/sign-in", async (req, res) => {
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
})

app.get('/home', async (req, res) => {
    const authorization = req.headers['authorization'];

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
 })

app.get('/register', async (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.replace('Bearer ', "");

    const response = await connection.query(`
        SELECT transactions.* 
        FROM transactions
        JOIN sessions
        ON sessions."userEmail" = transactions."userEmail"
        WHERE sessions.token = $1
    `, [token]);

    res.status(200).send(response.rows);
})

app.post('/new-entry', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', "");

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
})

app.post('/new-expense', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', "");

        const {value, description} = req.body;

        if(!value || description?.length === 0) {
            return res.sendStatus(400);
        }

        let valueInteger = value?.replace(".", "");

        if(valueInteger) valueInteger = valueInteger*(-1) 

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
})

app.get('/sign-out', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace("Bearer ", "");
    
        await connection.query(`
            DELETE FROM sessions WHERE "token" = $1
        `, [token]);

        res.sendStatus(200);
    } catch(err) {
        res.status(500).send(err);
    }
})

app.get('/test', (req, res) => {
    res.sendStatus(200)
})


export default app;