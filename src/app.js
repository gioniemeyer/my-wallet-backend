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


        if (response.rows.length > 0) return res.sendStatus(401);

        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3)
        `, [name, email, hash]);

        res.send(201);
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

    if (!response.rows) return res.sendStatus(401);
    
    const user = response.rows[0];

    if(bcrypt.compareSync(password, user.password)) {
        const token = uuid();

        await connection.query(`
            DELETE FROM sessions WHERE "userId" = $1
        `, [user.id]);

        await connection.query(`
            INSERT INTO sessions ("userId", token) VALUES ($1, $2)
        `, [user.id, token]);
        res.send(token);
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
        ON users.id = sessions."userId"
        WHERE token = $1
    `, [token]);

    const user = result.rows[0];

    if(user) {
        delete user?.password;
        res.send(user);
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
        ON sessions."userId" = transactions."userId"
        WHERE sessions.token = $1
    `, [token]);

    res.send(response.rows);
})

app.post('/new-entry', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', "");

        const {value, description} = req.body;

        const valueInteger = value.replace(".", "");

        const response = await connection.query(`
            SELECT * from sessions WHERE token = $1
        `,[token]);

        const session = response.rows[0];

        await connection.query(`
            INSERT INTO transactions (date, description, value, "userId") 
            VALUES (NOW(), $1, $2, $3)
        `, [description, valueInteger, session.userId]);

        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err);
    }
})

app.post('/new-expense', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', "");

        const {value, description} = req.body;

        const valueInteger = value.replace(".", "") * (-1);

        const response = await connection.query(`
            SELECT * from sessions WHERE token = $1
        `,[token]);

        const session = response.rows[0];

        await connection.query(`
            INSERT INTO transactions (date, description, value, "userId") 
            VALUES (NOW(), $1, $2, $3)
        `, [description, valueInteger, session.userId]);

        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err);
    }
})

app.get('/sign-out', async (req, res) => {
    const authorization = req.headers['authorization'];
    const token = authorization.replace("Bearer ", "");

    console.log(token);
    
    await connection.query(`
        DELETE FROM sessions WHERE "token" = $1
    `, [token]);

    res.sendStatus(200);
})

app.get('/test', (req, res) => {
    res.sendStatus(200)
})


export default app;