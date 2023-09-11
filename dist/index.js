"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const port = 3003;
const app = (0, express_1.default)();
const auth_1 = __importDefault(require("./routes/auth"));
const todo_1 = __importDefault(require("./routes/todo"));
app.use((0, cors_1.default)()); //this line tells Express to use the cors middleware for all incoming requests. 
app.use(express_1.default.json()); //specifically parses JSON data from the request body for all incoming requests,
app.use("/auth", auth_1.default); //. It means that the authRoutes will be used for any routes that start with /auth
app.use("/todo", todo_1.default);
app.listen(port, () => {
    console.log(`This todo app is listening at http://localhost:${port}`);
});
mongoose_1.default.connect('', {});
