/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import loadDotEnv from "./setup.js";
import pg from "pg";

const databaseConfig = {
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
};
const {Pool} = pg; 
const connection = new Pool(databaseConfig);

export default connection;