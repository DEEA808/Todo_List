

import { useEffect, useState } from 'react';
import './AppComponent.css';
import { Task } from './Task';
import { CSVLink } from "react-csv";
import axios from 'axios'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { Owner } from './Owner';
import Login from './login';
import Register from './registration';
import ProtectedRoute from './protected';
import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';

function TodoItem({ match }) {
  const [todo, setTodo] = useState(null);
  const todoId = match.params.id;

  useEffect(() => {
    axios.get(`http://localhost:8081/get/${todoId}`)
      .then(response => {
        setTodo(response.data);
      })
      .catch(error => {
        console.error('Error fetching todo:', error);
        alert('Todo item not found')
      });
  }, [todoId]);

  if (!todo) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Todo Details</h2>
      <p>ID: {todo.id}</p>
      <p>Task Name: {todo.taskName}</p>
      <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
      <p>Owner_id:{todo.owner}</p>
    </div>
  );
}




function AppComponent() {
  const [todoList, setTodoList] = useState(() => {
    const saveTodoList = localStorage.getItem('todoList');
    return saveTodoList ? JSON.parse(saveTodoList) : [];
  });


  const [ownersList, setOwnersList] = useState([]);
  const storedItems = JSON.parse(localStorage.getItem('items')) || [];
  const storedItemsOwner = JSON.parse(localStorage.getItem('itemsOwner')) || [];

const loadData = () => {
  setTimeout(() => {
  console.log("fetch");
  console.log(storedItems);
  fetch('http://localhost:8081/tasks')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const d = data;
      if (storedItems.length !== 0) {
        const tasksToAdd = storedItems.map(task => axios.post('http://localhost:8081/add', task));
        const tasksToUpdate = storedItems.map(task => axios.put(`http://localhost:8081/update/${task.id}`, task));
        Promise.all([...tasksToAdd, ...tasksToUpdate])
          .then(responses => {
            responses.forEach(res => {
              console.log(res.status);
            });
            localStorage.removeItem('items');
            setTodoList([...d, ...storedItems]);
          })
          .catch(err => {
            console.error('Error synchronizing tasks:', err);
          });
      } else {
        setTodoList(d);
      }
    })
    .catch(err => {
      console.error('Error fetching data:', err.message);
    });
},100000)};
useEffect(() => {
        loadData();
}, []);

const loadDataOwner = () => {
  console.log("fetch");
  console.log(storedItemsOwner);
  fetch('http://localhost:8081/owners')
  .then(res => {return res.json()})
  .then(data => {
      console.log(data);
      const d = data;
      if(storedItemsOwner.length != 0)
      {
          for(let si of storedItemsOwner){
              axios.post('http://localhost:8081/addOwner',  {...si})
              .then(res => {alert(res.status);})
              .catch(err => {console.log(err);})
              d.push(si);
          }
          localStorage.removeItem('itemsOwner');
      }
      setOwnersList(d);
  })
  .catch(err => {
      console.log(err.message);
      })
}

useEffect(() => {
      loadDataOwner();
}, []);


  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }, [todoList]);

  // useEffect(() => {
  //   axios.get('http://localhost:8081/userTasks',{withCredentials:true})
  //     .then(res =>{console.log(res.data);setTodoList(res.data) } )
  //     .catch(err => console.log(err))
  // }, [todoList])

  // useEffect(() => {
  //   axios.get('http://localhost:8081/tasks',{withCredentials:true})
  //     .then(res =>{console.log(res.data);setTodoList(res.data) } )
  //     .catch(err => console.log(err))
  // }, [todoList])

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:8081/tasks', { withCredentials: true })
        .then(res => {
          console.log(res.data);
          setTodoList(res.data);
        })
        .catch(err => console.log(err));
    };

    const timeoutId = setTimeout(fetchData, 1000); // Set delay to 1000ms (1 second)

    return () => clearTimeout(timeoutId); // Cleanup the timeout if the component unmounts
  }, [todoList]);

  // useEffect(() => {
  //   const fetchData = () => {
  //     axios.get('http://localhost:8081/tasks', { withCredentials: true })
  //       .then(res => {
  //         console.log(res.data);
  //         setTodoList(res.data);
  //       })
  //       .catch(err => console.log(err));
  //   };

  //   const timeoutId = setTimeout(fetchData, 1000); // Set delay to 1000ms (1 second)

  //   return () => clearTimeout(timeoutId); // Cleanup the timeout if the component unmounts
  // }, [todoList]);

  useEffect(() => {
    axios.get('http://localhost:8081/owners')
      .then(res => { setOwnersList(res.data) })
      .catch(err => console.log(err))
  }, [ownersList])



  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState(false);
  const [filterOwners, setFilterOwners] = useState(false);
  const [listFilteredOwners, setOwnersListFiltered] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [newOwner, setNewOwner] = useState('');
  const [filterType,setFilterType]=useState('');

  // const handleFilterOwnersByAge = () => {
  //   if (filterType.trim() !== '') {
  //     const fil =filterType;
  //   axios.get('http://localhost:8081/ownersByAge',fil)
  //     .then(res => {
  //       setOwnersListFiltered(res.data);
  //       setFilterType('');
  //     })
  //     .catch(err => console.log(err));
  // }};
  const handleFilterOwnersByAge = () => {
    if (filterType.trim() !== '') {
      const params = { col: filterType };
      axios.get('http://localhost:8081/ownersByAge', { params })
        .then(res => {
          setOwnersListFiltered(res.data);
          setFilterType('');
        })
        .catch(err => console.log(err));
    }
  };
  
  


  const handleChange = (event) => {
    setNewTask(event.target.value);
  };
  const handleChangeFilterParam = (event) => {
    setFilterType(event.target.value);
  };

  const handleChangeOwner = (event) => {
    setNewOwner(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        taskname: newTask // Assuming taskname is the only field required for addition
      };

      axios.post('http://localhost:8081/add', task, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          // Update todoList with the response data
          setTodoList([...todoList, res.data]); // Assuming res.data contains the newly added task
          setNewTask('');
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            alert('Task name already exists! Please choose a different name.');
          } else {
            console.error('Error adding task:', error);
          }
          alert('Server is down');
          const h = storedItems;
          h.push(task)
          localStorage.setItem('items', JSON.stringify(h));
          setTimeout(loadData, 100000);

        });
    }
  };


  const addOwner = () => {
    if (newOwner.trim() !== '') {
      const owner = {
        name: newOwner // Assuming taskname is the only field required for addition
      };

      axios.post('http://localhost:8081/addOwner', owner, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          // Update todoList with the response data
          setOwnersList([...ownersList, res.data]); // Assuming res.data contains the newly added task
          setNewOwner('');
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            alert('Task name already exists! Please choose a different name.');
          } else {
            console.error('Error adding task:', error);
          }
          alert('Server is down');
          const h = storedItemsOwner;
          h.push(owner)
          localStorage.setItem('itemsOwner', JSON.stringify(h));

        });
    }
  };




  // const deleteTask = (id) => {
  //   setTodoList(todoList.filter(task => task.id !== id));
  //   setSelectedTasks(selectedTasks.filter(taskId => taskId !== id));
  // };

  const deleteTask = async (taskId) => {
    try {
      // Send a DELETE request to the server
      const response = await axios.delete(`http://localhost:8081/delete/${taskId}`);

      // Check if the request was successful
      if (response.status === 200) {
        console.log('Task deleted successfully');
        // Optionally, you can perform additional actions here, such as updating the UI
      }
    } catch (error) {
      // Handle errors
      console.error('Error deleting task:', error);
      // Optionally, you can display an error message to the user
    }
  };

  const deleteOwner = async (ownerId) => {

    try {
      const response = await axios.delete(`http://localhost:8081/deleteOwner/${ownerId}`);
      if (response.status === 200) {
        console.log('Owner deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting owner:', error);
    }

  };


  const completeTask = (id) => {
    setTodoList(
      todoList.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed }
        }
        return task;
      })
    );
  };


  const handleFilter = () => {
    setFilter(!filter);
  };
  const handleFilterOwners = () => {
    setFilterOwners(!filterOwners);
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedTasks([...selectedTasks, id]);
    } else {
      setSelectedTasks(selectedTasks.filter(taskId => taskId !== id));
    }
  };




  // const deleteSelectedTasks = () => {
  //   setTodoList(todoList.filter(task => !selectedTasks.includes(task.id)));
  //   setSelectedTasks([]);
  // };
  const deleteSelectedTasks = async () => {
    for (const id of selectedTasks) {
      try {
        // Send a DELETE request to the server
        const response = await axios.delete(`http://localhost:8081/delete/${id}`);

        // Check if the request was successful
        if (response.status === 200) {
          console.log('Task deleted successfully');
          // Optionally, you can perform additional actions here, such as updating the UI
        }
      } catch (error) {
        // Handle errors
        console.error('Error deleting task:', error);
        // Optionally, you can display an error message to the user
      }
    }
  };




  useEffect(() => {
    if (filterOwners) {
      handleFilterOwnersByAge();
    }
  }, [filterOwners]);

  let filteredTasks = filter ? todoList.filter(task => task.completed) : todoList;
  let ownerss = filterOwners ? listFilteredOwners : ownersList;


  const updateTask = (id, updatedTaskName) => {
    axios.put(`http://localhost:8081/update/${id}`, { taskName: updatedTaskName })
      .then(response => {
        setTodoList(
          todoList.map(task => {
            if (task.id === id) {
              return { ...task, taskName: updatedTaskName };
            }
            return task;
          })
        );
      })
      .catch(error => {
        //alert('This task can not be found');
        alert('Server is down');
      const updatedTask = { id, taskName: updatedTaskName };
      const updatedTasks = [...storedItems];
      const existingTaskIndex = updatedTasks.findIndex(task => task.id === id);
      if (existingTaskIndex !== -1) {
        updatedTasks[existingTaskIndex] = updatedTask;
      } else {
        updatedTasks.push(updatedTask);
      }
      localStorage.setItem('items', JSON.stringify(updatedTasks));
      setTimeout(loadData, 5000);
      });
  };
  const updateOwner = (id, updatedOwnerName) => {
    axios.put(`http://localhost:8081/updateOwner/${id}`, { name: updatedOwnerName })
      .then(response => {
        setTodoList(
          ownersList.map(owner => {
            if (owner.id === id) {
              return { ...owner, name: updatedOwnerName };
            }
            return owner;
          })
        );
      })
      .catch(error => {
        alert('This owner can not be found');
      });
  };

  return (
      <div className="App">
        <div className="addTask">
          <input type='text' placeholder='Add a task' value={newTask} onChange={handleChange} />
          <button onClick={addTask}>Add Task</button>
          <button onClick={handleFilter}>Filter</button>
          <input type='text' placeholder='filterBy' value={filterType} onChange={handleChangeFilterParam} />
          <button onClick={handleFilterOwners}>Filter Owners</button>
          {selectedTasks.length > 0 && <button onClick={deleteSelectedTasks}>Delete Selected</button>}
        </div>
        <div className='lists'>
          <div className="list">
            {todoList.map((task) => (
              <div key={task.id} className="task">
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={(event) => handleCheckboxChange(event, task.id)}
                />

                <Task
                  ownerId={task.owner_id}
                  taskName={task.taskname}
                  completed={task.completed}
                  deleteTask={() => deleteTask(task.id)}
                  completeTask={() => completeTask(task.id)}
                  // updateTask={(updatedTaskName) => updateTask(task.id, updatedTaskName)}
                  updateTask={(updatedTaskName) => updateTask(task.id, updatedTaskName)}
                />
              </div>
            ))}
          </div>
          <div className='OwnerButtons'>
            <input className='input' type='text' placeholder='Add an owner' value={newOwner} onChange={handleChangeOwner} />
            <button className='OwnerAdd' onClick={addOwner} >Add Owner</button>
            <div className='OwnersList'>
              {ownerss.map((owner) => (
                <Owner
                  ownerAge={owner.age}
                  ownerId={owner.id}
                  ownerName={owner.name}
                  deleteOwner={() => deleteOwner(owner.id)}
                  updateOwner={(updatedOwnerName) => updateOwner(owner.id, updatedOwnerName)}

                />
              ))}
            </div>
          </div>
        </div>
        <div className='csv-button'>
          <CSVLink className='react-csv-link' data={todoList}>Export</CSVLink>
        </div>
        </div>
  );
}

export default AppComponent;




