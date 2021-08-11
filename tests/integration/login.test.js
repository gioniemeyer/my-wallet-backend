/* eslint-disable no-undef */
import supertest from "supertest";
import app from "../../src/app.js";
import { clearDatabase, endConnection } from "../utils/database.js";

beforeEach(async () => {
	await clearDatabase();
});

afterAll(async () => {
	endConnection();
});

describe("GET /subscribe", () => {
	it("returns 201 for valid params", async () => {
		const body = {
			name: "teste",
			email: "teste@teste.com",
			password: "teste123"
		};
		const result = await supertest(app).post("/subscribe").send(body);
		expect(result.status).toEqual(201);
	});

	it("returns 409 for duplicated email", async () => {
		const body = {
			name: "teste",
			email: "teste@teste.com",
			password: "teste123"
		};

		await supertest(app).post("/subscribe").send(body);

		const result = await supertest(app).post("/subscribe").send(body);
		expect(result.status).toEqual(409);
	});

	it("returns 400 for invalid params", async () => {
		const body = {
			name: "",
			email: "teste@teste.com",
			password: "teste123"
		};
		const result = await supertest(app).post("/subscribe").send(body);
		expect(result.status).toEqual(400);
	});
    
	it("returns 400 for invalid params", async () => {
		const body = {
			email: "teste@teste.com",
			password: "teste123"
		};
		const result = await supertest(app).post("/subscribe").send(body);
		expect(result.status).toEqual(400);
	});

});

describe("POST /sign-in", () => {
	it("returns a token when correct email and password", async () => {
		const body = {
			name: "teste",
			email: "teste@teste.com",
			password: "teste123"
		};

		const body2 = {
			email: "teste@teste.com",
			password: "teste123"
		};
		await supertest(app).post("/subscribe").send(body);
		const result = await supertest(app).post("/sign-in").send(body2);
        
		expect(result.status).toEqual(200);
		expect(typeof result.text).toBe("string");
	});

	it("returns 404 when email not found", async () => {

		const body = {
			email: "teste@teste.com",
			password: "teste123"
		};
		const result = await supertest(app).post("/sign-in").send(body);
        
		expect(result.status).toEqual(404);

	});

	it("returns 400 for invalid params", async () => {

		const body = {
			email: "teste@teste.com",
		};
		const result = await supertest(app).post("/sign-in").send(body);
        
		expect(result.status).toEqual(400);

	});

	it("returns 401 when password is incorrect", async () => {

		const body = {
			name: "teste",
			email: "teste@teste.com",
			password: "teste123"
		};

		await supertest(app).post("/subscribe").send(body);

		const body2 = {
			email: "teste@teste.com",
			password: "teste"
		};
		const result = await supertest(app).post("/sign-in").send(body2);
        
		expect(result.status).toEqual(401);
	});
}); 