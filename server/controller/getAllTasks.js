// import { todoList } from "../modell/todoListt.js";
const { todoList } = require('../modell/todoListt.js');
function getAll(req, res){
    if (todoList.length > 0) {
        res.status(200).send(todoList);
    } else {
        res.status(404).json({ error: 'No tasks found' });
    }
};


module.exports = getAll;