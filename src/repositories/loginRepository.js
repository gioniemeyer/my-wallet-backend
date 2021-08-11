import connection from "../database.js";

export async function addUser(name, email, hash) {
	await connection.query(`
    INSERT INTO users
    (name, email, password)
    VALUES ($1, $2, $3)
`, [name, email, hash]);
}

export async function deleteOlderSession(user) {
	connection.query(`
    DELETE FROM sessions WHERE "userEmail" = $1
`, [user.email]);
}

export async function createNewSession(user, token) {
	await connection.query(`
    INSERT INTO sessions ("userEmail", token) VALUES ($1, $2)
`, [user.email, token]);
}