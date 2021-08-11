import * as userRepository from "../repositories/userRepository.js";

export async function validateToken(req, res, next) {
	const authorization = req.headers["authorization"];
	const token = authorization?.replace("Bearer ", "");

	if(token?.length === 0) return res.sendStatus(401);
	const user = await userRepository.validateSession(token);

	if(!user) return res.sendStatus(401);

	res.locals.user = user;

	next();
}