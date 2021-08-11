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

export async function getUserTransactions(token) {
	const registers = await connection.query(`
    SELECT transactions.* 
    FROM transactions
    JOIN sessions
    ON sessions."userEmail" = transactions."userEmail"
    WHERE sessions.token = $1
`, [token]);
	return registers.rows;
}

export async function addUserTransaction(valueInteger,description, email) {
	connection.query(`
    INSERT INTO transactions (date, description, value, "userEmail") 
    VALUES (NOW(), $1, $2, $3)
`, [description, valueInteger, email]);
}