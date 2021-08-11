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
    DELETE FROM sessions WHERE "userId" = $1
`, [user.id]);
}

export async function createNewSession(user, token) {
	await connection.query(`
    INSERT INTO sessions ("userId", token) VALUES ($1, $2)
`, [user.id, token]);
}