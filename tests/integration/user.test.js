/* eslint-disable no-undef */
import supertest from "supertest";
import app from "../../src/app.js";
import { clearDatabase, endConnection} from "../utils/database.js";
import { generateSignUpBody } from "../factories/loginFactory.js";
import { generateTransactionBody, generateWrongTransactionBody } from "../factories/transactionFactory.js";

beforeEach(async () => {
	await clearDatabase();
});

afterAll(async () => {
	endConnection();
});

const user = generateSignUpBody();
const signInBody = {
	email: user.email,
	password: user.password
};
const transaction = generateTransactionBody();
const incompleteTransaction = generateWrongTransactionBody();

describe("GET /home", () => {

	it("returns 200 for valid token", async () => {

		await supertest(app).post("/subscribe").send(user);
		const tokenResp = await supertest(app).post("/sign-in").send(signInBody);
		const token = tokenResp.text;
		const response = await supertest(app).get("/home").set("Authorization", `Bearer ${token}`);
		expect(response.status).toEqual(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				user: expect.any(String),
				transactions: expect.any(Array)
			})
		);
	});

	it("returns 401 for request with invalid or without token", async () => {

		const result = await supertest(app).get("/home");
		expect(result.status).toEqual(401);
	});
});

describe("POST /new-entry", () => {
	it("returns 201 for valid input", async () => {
		await supertest(app).post("/subscribe").send(user);
		const tokenResp = await supertest(app).post("/sign-in").send(signInBody);
		const token = tokenResp.text;
		await supertest(app).get("/home").set("Authorization", `Bearer ${token}`);
		const response = await supertest(app).post("/new-entry")
			.set("Authorization", `Bearer ${token}`)
			.send(transaction);

		expect(response.status).toEqual(201);

	});

	it("returns 400 for invalid input", async () => {
		await supertest(app).post("/subscribe").send(user);
		const tokenResp = await supertest(app).post("/sign-in").send(signInBody);
		const token = tokenResp.text;
		await supertest(app).get("/home").set("Authorization", `Bearer ${token}`);
		const response = await supertest(app).post("/new-entry")
			.set("Authorization", `Bearer ${token}`)
			.send(incompleteTransaction);

		expect(response.status).toEqual(400);

	});
});

describe("POST /new-expense", () => {
	it("returns 201 for valid input", async () => {
		await supertest(app).post("/subscribe").send(user);
		const tokenResp = await supertest(app).post("/sign-in").send(signInBody);
		const token = tokenResp.text;
		await supertest(app).get("/home").set("Authorization", `Bearer ${token}`);
		const response = await supertest(app).post("/new-expense")
			.set("Authorization", `Bearer ${token}`)
			.send(transaction);

		expect(response.status).toEqual(201);

	});

	it("returns 400 for invalid input", async () => {
		await supertest(app).post("/subscribe").send(user);
		const tokenResp = await supertest(app).post("/sign-in").send(signInBody);
		const token = tokenResp.text;
		await supertest(app).get("/home").set("Authorization", `Bearer ${token}`);
		const response = await supertest(app).post("/new-expense")
			.set("Authorization", `Bearer ${token}`)
			.send(incompleteTransaction);

		expect(response.status).toEqual(400);

	});
});