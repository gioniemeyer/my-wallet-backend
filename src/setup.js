import dotenv from "dotenv";
// eslint-disable-next-line no-undef
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

const loadDotEnv = dotenv.config({
	path: envFile
});

export default loadDotEnv;