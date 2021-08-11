import express from "express";
import cors from "cors";

import * as loginController from "./controllers/loginController.js";
import * as authMiddleware from "./middlewares/authMiddleware.js";
import * as userController from "./controllers/userController.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/subscribe", loginController.signUp);

app.post("/sign-in", loginController.signIn);

app.get("/home", authMiddleware.validateToken, userController.sendUserInfos);

app.post("/new-expense", authMiddleware.validateToken, userController.userExpense);

app.post("/new-entry", authMiddleware.validateToken, userController.userEntry);

app.get("/sign-out", authMiddleware.validateToken, loginController.signOut);

export default app;