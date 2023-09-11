"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const router = express_1.default.Router();
router.post('/todos', middleware_1.authenticateJwt, (req, res) => {
    const { title, description } = req.body;
    const done = false; // cuz when we create a todo its not initially done
    const userId = req.headers["userId"];
    const newTodo = new db_1.Todo({ title, description, done, userId });
    //ab is naye todo ko database mei save krdo
    newTodo.save()
        .then((savedTodo) => {
        res.status(201).json(savedTodo);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to create nw todo' });
    });
});
// The very reason we are storing the userid in newtodo is ki when we make a get request then just cuz its saved we can get all the todos specific to thatuser
// basically this is piece is imp for the platform
router.get('/todos', middleware_1.authenticateJwt, (req, res) => {
    const userId = req.headers["userId"];
    db_1.Todo.find({ userId })
        .then((todos) => {
        res.json(todos);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to get todos' });
    });
});
// request to change some data
// VVVIMMPP
// is ki the user that is made the todo is the 1 thats gets to change it thats y we pass userid along with
router.put('/todos/:todoId/done', middleware_1.authenticateJwt, (req, res) => {
    const { todoId } = req.params;
    const userId = req.headers["userId"];
    // is ki the user that has made the todo is the 1 thats gets to change it thats y we pass userid along with
    db_1.Todo.findOneAndUpdate({ id: todoId, userId }, { done: false }, { new: true })
        .then((updateTodo) => {
        if (!updateTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updateTodo);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to update todo' });
    });
});
exports.default = router;
