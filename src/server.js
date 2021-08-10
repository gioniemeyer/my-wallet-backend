/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import loadDotEnv from "./setup.js";
import app from "./app.js";

app.listen(process.env.PORT, () => {
	console.log("Server running on port " + process.env.PORT);
});