/* eslint-disable no-undef */
import supertest from "supertest";
import app from "../../src/app.js";
import { clearDatabase, endConnection } from "../utils/database.js";
import { generateSignUpBody } from "../factories/loginFactory.js";

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
const incompleteSignInBody = {
	email: user.email
};
const wrongSignInBody = {
	email: user.email,
	password: user.password + "erro"
};

describe("POST /sign-in", () => {
	it("returns a token when correct email and password", async () => {

		await supertest(app).post("/subscribe").send(user);
		const result = await supertest(app).post("/sign-in").send(signInBody);
        
		expect(result.status).toEqual(200);
		expect(typeof result.text).toBe("string");
	});

	it("returns 404 when email not found", async () => {

		const result = await supertest(app).post("/sign-in").send(signInBody);
        
		expect(result.status).toEqual(404);

	});

	it("returns 400 for invalid params", async () => {

		const result = await supertest(app).post("/sign-in").send(incompleteSignInBody);
        
		expect(result.status).toEqual(400);

	});

	it("returns 401 when password is incorrect", async () => {

		await supertest(app).post("/subscribe").send(user);

		const result = await supertest(app).post("/sign-in").send(wrongSignInBody);
        
		expect(result.status).toEqual(401);
	});
}); 