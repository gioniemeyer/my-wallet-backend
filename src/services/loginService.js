import connection from "../database.js";
import bcrypt from "bcrypt";
import * as loginRepository from "../repositories/loginRepository.js";

export async function signUp(name, email, password) {
   
	const hash = bcrypt.hashSync(password, 10);

	const validUser = await checkUserByEmail(email);

	if(!validUser) return false;

	await loginRepository.addUser(name, email, hash);

	return true;
}

async function checkUserByEmail(email) {
	const userByEmail = await connection.query(`
        SELECT * FROM users WHERE email = $1
    `,[email]);


	if (userByEmail.rows.length > 0) return false;
	return true;
}