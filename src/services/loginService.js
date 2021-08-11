import connection from "../database.js";
import bcrypt from "bcrypt";
import { v4 as uuid} from "uuid";
import * as loginRepository from "../repositories/loginRepository.js";

export async function signUp(name, email, password) {
   
	const hash = bcrypt.hashSync(password, 10);

	const validUser = await checkUserByEmail(email);

	if(validUser) return false;

	await loginRepository.addUser(name, email, hash);

	return true;
}

export async function checkUserByEmail(email) {
	const userByEmail = await connection.query(`
        SELECT * FROM users WHERE email = $1
    `,[email]);

	return userByEmail.rows[0];
}

export async function signIn(user, password) {

	const correctPassword = checkPassword(password, user);
	if(correctPassword) {
		const token = uuid();
		await loginRepository.deleteOlderSession(user);
		await loginRepository.createNewSession(user, token);
		return token;
	} else {
		return false;
	}
}

function checkPassword(password, user) {
	const validPassword = bcrypt.compareSync(password, user?.password);
	return validPassword;
}