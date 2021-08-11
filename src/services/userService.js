import * as userRepository from "../repositories/userRepository.js";

export async function userInfos(user) {
	const transactions = await userRepository.getUserTransactions(user.token);
	const userData = {user: user.name, transactions};
	return(userData);
}