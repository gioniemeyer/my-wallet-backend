import express from "express";
import cors from "cors";
import pg from 'pg';
import bcrypt from 'bcrypt';

import {SubscribeSchema} from './Schemas/SubscribeSchema.js';
import {LoginSchema} from './Schemas/LoginSchema.js';

const app = express();

app.use(cors());
app.use(express.json());

const databaseConfig = {
    user: 'postgres',
    password: '123456',
    database: 'mywallet',
    host: 'localhost',
    port: 5432
};

const { Pool } = pg;
const connection = new Pool(databaseConfig);


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
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

})

console.log("server running on port 4000");

app.listen(4000);