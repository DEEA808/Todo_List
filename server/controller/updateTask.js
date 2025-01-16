// import { todoList } from "../modell/todoListt.js";
const { todoList } = require('../modell/todoListt.js');


function updTask(req, res){
    const id = req.params.id;
    const updatedTaskName = req.body.taskName;
    const index = todoList.findIndex(todo => todo.id === parseInt(id));
    if (index !== -1) {
      todoList[index].taskName = updatedTaskName;
      res.json(todoList[index]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  };
  module.exports = updTask;