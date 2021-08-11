export async function sendUserInfos(req, res) {
	const user = res.locals.user;
	if(user) {
		delete user?.password;
		res.status(200).send(user);
	} else {
		res.sendStatus(401);
	}
} 