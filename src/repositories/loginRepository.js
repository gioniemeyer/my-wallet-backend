import connection from "../database.js";

export async function addUser(name, email, hash) {
	await connection.query(`
    INSERT INTO users
    (name, email, password)
    VALUES ($1, $2, $3)
`, [name, email, hash]);
}