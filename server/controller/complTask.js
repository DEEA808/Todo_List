const { todoList } = require('../modell/todoListt.js');

function completeTask(req, res) {
    const taskId = parseInt(req.params.id);
    const taskIndex = todoList.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        todoList[taskIndex].completed = true;
        res.status(200).send(todoList[taskIndex]); // Return the updated task
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
}

module.exports = completeTask;