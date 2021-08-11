import connection from "../database.js";

export async function validateSession(token) {
	const result = await connection.query(`
    SELECT users.*, sessions.token
    FROM sessions
    JOIN users
    ON users.email = sessions."userEmail"
    WHERE token = $1
`, [token]);

	const user = result.rows[0];
	return user;
}