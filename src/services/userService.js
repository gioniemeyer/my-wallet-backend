import * as userRepository from "../repositories/userRepository.js";

export async function userInfos(user) {
	const transactions = await userRepository.getUserTransactions(user.token);
	const userData = {user: user.name, transactions};
	return(userData);
}

export async function addExpense(value, description, id) {
	let valueInteger = (value.replace(".", "") * (-1));
	await userRepository.addUserTransaction(valueInteger, description, id);
}

export async function addEntry(value, description, id) {
	const valueInteger = value?.replace(".", "");
	await userRepository.addUserTransaction(valueInteger, description, id);
}