import faker from "faker";

export function generateTransactionBody () {
	return {
		value: "100.00",
		description: faker.lorem.text()
	};
}

export function generateWrongTransactionBody () {
	return {
		value: "100.00"
	};
}