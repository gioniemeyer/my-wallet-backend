import * as userServices from "../services/userService.js";

export async function sendUserInfos(req, res) {
	const user = res.locals.user;

	const userInfos = await userServices.userInfos(user);

	if(userInfos) {
		res.status(200).send(userInfos);
	} else {
		res.sendStatus(401);
	}
} 