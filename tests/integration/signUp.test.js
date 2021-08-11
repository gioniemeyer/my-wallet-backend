/* eslint-disable no-undef */
import supertest from "supertest";
import app from "../../src/app.js";
import { clearDatabase, endConnection } from "../utils/database.js";
import {user, generateWrongSignUpBody} from "../factories/loginFactory.js";

beforeEach(async () => {
	await clearDatabase();
});

afterAll(async () => {
	endConnection();
});

const wrongUser = generateWrongSignUpBody();

describe("GET /subscribe", () => {

	it("returns 201 for valid params", async () => {

		const result = await supertest(app).post("/subscribe").send(user);
		expect(result.status).toEqual(201);
	});

	it("returns 409 for duplicated email", async () => {

		await supertest(app).post("/subscribe").send(user);

		const result = await supertest(app).post("/subscribe").send(user);
		expect(result.status).toEqual(409);
	});

	it("returns 400 for invalid params", async () => {

		const result = await supertest(app).post("/subscribe").send(wrongUser);
		expect(result.status).toEqual(400);
	});
});