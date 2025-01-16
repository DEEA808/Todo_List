// import { todoList } from "../modell/todoListt.js";
const { todoList } = require('../modell/todoListt.js');


function delTask(req, res){
    const todoId = parseInt(req.params.id);
    console.log(req);
    const index = todoList.findIndex(todo => todo.id === todoId);
    if (index !== -1) {
        todoList.splice(index, 1);
        res.status(200).send(todoList);
        console.log(todoList);
    } else {
        res.status(404).send({ message: 'Task not found' });
    }
};

module.exports = delTask;