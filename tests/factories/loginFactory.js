import faker from "faker";

export function generateSignUpBody () {
	return {
		name: faker.name.findName(),
		email: faker.internet.email(),
		password: faker.internet.password()
	};
}

export function generateWrongSignUpBody () {
	return {
		name: "",
		email: faker.internet.email(),
		password: faker.internet.password()
	};
}

const user = generateSignUpBody();
const signInBody = {
	email: user.email,
	password: user.password
};
const incompleteSignInBody = {
	email: user.email
};
const wrongSignInBody = {
	email: user.email,
	password: user.password + "erro"
};

export {user, signInBody, incompleteSignInBody, wrongSignInBody};