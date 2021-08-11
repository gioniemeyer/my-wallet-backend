import connection from "../../src/database.js";

export async function clearDatabase () {
	await connection.query("TRUNCATE users RESTART IDENTITY");
	await connection.query("TRUNCATE sessions RESTART IDENTITY");
	await connection.query("TRUNCATE transactions RESTART IDENTITY");
}

export async function endConnection () {
	await clearDatabase();
	await connection.end();
}