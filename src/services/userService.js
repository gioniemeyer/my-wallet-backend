import * as userRepository from "../repositories/userRepository.js";

export async function userInfos(user) {
	const transactions = await userRepository.getUserTransactions(user.token);
	const userData = {user: user.name, transactions};
	return(userData);
}

export async function insertExpense(value, description, email) {
	let valueInteger = (value.replace(".", "") * (-1));
	await userRepository.addExpense(valueInteger, description, email);
}