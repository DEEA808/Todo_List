
const { todoList } = require('../modell/todoListt.js');

function addNewTask(req, res) {
    let todo = req.body;
    console.log(req.body);

    const taskExists = todoList.some(item => item.taskName === todo.taskName);
    if (taskExists)
        res.status(400).send({ mess: "task already exists" })
    else {
        todoList.push(todo);
        res.status(201).send(todoList);
    }
}

module.exports = addNewTask;
