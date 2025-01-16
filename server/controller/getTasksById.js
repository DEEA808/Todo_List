const { todoList } = require('../modell/todoListt.js');

function getTaskById(req, res){
    const todoId = parseInt(req.params.id); 
    const todo = todoList.find(todo => todo.id === todoId);
    if (todo) {
        res.status(200).send(todo); 
    } else {
        res.status(404).json({ message: 'Todo item not found' }); 
    }
}

module.exports=getTaskById;