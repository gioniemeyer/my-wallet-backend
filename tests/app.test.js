import supertest from "supertest";
import app from "../src/app.js"
import connection from "../src/database.js";
import database from "../src/database.js";

let data = [];
const dataUsers = [];

beforeAll(async () => {
    data = await connection.query("SELECT * FROM users");
    dataUsers.push(data.rows);

    await connection.query("DELETE FROM users")
});

afterAll(async () => {
    await connection.query("DELETE FROM users")

    for(let i = 0; i < dataUsers[0].length; i++) {
        const name = dataUsers[0][i].name;
        const email = dataUsers[0][i].email;
        const password = dataUsers[0][i].password;
        await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
        `,[name, email, password]);
    }

    connection.end();
})

describe('GET /subscribe', () => {
    it("returns 201 for valid params", async () => {
        const body = {
            name: "teste",
            email: "teste@teste.com",
            password: "teste123"
        };
        const result = await supertest(app).post("/subscribe").send(body)
        expect(result.status).toEqual(201);
    });

    it("returns 409 for duplicated email", async () => {
        const body = {
            name: "teste",
            email: "teste@teste.com",
            password: "teste123"
        };

        await supertest(app).post("/subscribe").send(body);

        const result = await supertest(app).post("/subscribe").send(body)
        expect(result.status).toEqual(409);
    });

    it("returns 400 for invalid params", async () => {
        const body = {
            name: "",
            email: "teste@teste.com",
            password: "teste123"
        };
        const result = await supertest(app).post("/subscribe").send(body)
        expect(result.status).toEqual(400);
    });
    
    it("returns 400 for invalid params", async () => {
        const body = {
            email: "teste@teste.com",
            password: "teste123"
        };
        const result = await supertest(app).post("/subscribe").send(body)
        expect(result.status).toEqual(400);
    });

})