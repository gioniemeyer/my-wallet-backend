import supertest from "supertest";
import app from "../src/app.js"
import connection from "../src/database.js";

let data = [];
const dataUsers = [];

beforeAll(async () => {
    data = await connection.query("SELECT * FROM users");
    dataUsers.push(data.rows);

});

beforeEach(async () => {
    await connection.query("DELETE FROM users");
})

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

describe('POST /sign-in', () => {
    it("returns a token when correct email and password", async () => {
        const body = {
            name: "teste",
            email: "teste@teste.com",
            password: "teste123"
        }

        const body2 = {
            email: "teste@teste.com",
            password: "teste123"
        }
        await supertest(app).post("/subscribe").send(body)
        const result = await supertest(app).post("/sign-in").send(body2);
        
        expect(result.status).toEqual(200);
        expect(typeof result.text).toBe('string');
    });

    it("returns 404 when email not found", async () => {

        const body = {
            email: "teste@teste.com",
            password: "teste123"
        }
        const result = await supertest(app).post("/sign-in").send(body);
        
        expect(result.status).toEqual(404);

    });

    it("returns 400 for invalid params", async () => {

        const body = {
            email: "teste@teste.com",
        }
        const result = await supertest(app).post("/sign-in").send(body);
        
        expect(result.status).toEqual(400);

    });

    it("returns 401 when password is incorrect", async () => {

        const body = {
            name: "teste",
            email: "teste@teste.com",
            password: "teste123"
        }

        await supertest(app).post("/subscribe").send(body)

        const body2 = {
            email: "teste@teste.com",
            password: "teste"
        }
        const result = await supertest(app).post("/sign-in").send(body2);
        
        expect(result.status).toEqual(401);
    });
}) 