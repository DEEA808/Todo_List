

const express = require('express');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const getAll = require('./controller/getAllTasks.js');
const getTaskById = require('./controller/getTasksById.js');
const addNewTask = require('./controller/addTask.js');
const delTask = require('./controller/deleteTask.js');
const updTask = require('./controller/updateTask.js');
const completeTask = require('./controller/complTask.js');
const { Pool } = require('pg');
const { createTypeReferenceDirectiveResolutionCache } = require('typescript');
const JWT =require('jsonwebtoken');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}));
app.use(express.json());


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432, 
});

app.listen(8081, () => { console.log("Server started on port 8081") })

// app.get('/tasks', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM TodoList');
//     res.send(rows);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/owners', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM Owner');
      res.send(rows);
    } catch (error) {
      console.error('Error fetching owners:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.get('/get/:id', getTaskById);



// app.post('/addOwner', async (req, res) => {
//   const { name } = req.body;


//   const age = Math.floor(Math.random() * (40 - 15 + 1)) + 15; 
//   try {
//     const result = await pool.query('INSERT INTO Owner (name,age) VALUES ($1, $2) RETURNING *', [name,age]);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error('Error adding task:', error);
//     res.status(500).json({ error: 'Failed to add owner' });
//   }
// });

// app.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;

//   try {
//       const result = await pool.query('DELETE FROM TodoList WHERE id = $1', [id]);
//       res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (error) {
//       console.error('Error deleting task:', error);
//       res.status(500).json({ error: 'Failed to delete task' });
//   }
// });

// app.delete('/deleteOwner/:id', async (req, res) => {
//   const id = req.params.id;

//   try {
//       const result = await pool.query('DELETE FROM Owner WHERE id = $1', [id]);
//       res.status(200).json({ message: 'Owner deleted successfully' });
//   } catch (error) {
//       console.error('Error deleting owner:', error);
//       res.status(500).json({ error: 'Failed to delete owner'});
//   }
// });

// app.put('/update/:id', async (req, res) => {
//   const id = req.params.id;
//   const updatedTaskName = req.body.taskName;

//   try {
//       const result = await pool.query('UPDATE TodoList SET taskName = $1 WHERE id = $2 RETURNING *', [updatedTaskName, id]);

//   } catch (error) {
//       console.error('Error updating task:', error);
//       res.status(500).json({ error: 'Failed to update task' });
//   }
// });

// app.put('/updateOwner/:id', async (req, res) => {
//   const id = req.params.id;
//   const updatedOwnerName = req.body.name;

//   try {
//       const result = await pool.query('UPDATE Owner SET name = $1 WHERE id = $2 RETURNING *', [updatedOwnerName, id]);

//   } catch (error) {
//       console.error('Error updating owner:', error);
//       res.status(500).json({ error: 'Failed to update owner' });
//   }
// });
app.get('/ownersByAge', async (req, res) => {
  const { col } = req.body;
  try {
      const { rows } = await pool.query('SELECT * FROM Owner ORDER BY $1',[col]);
      res.send(rows);
  } catch (error) {
      console.error('Error fetching owners:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
``

app.put('/complete/:id', completeTask);

const JWT_SECRET = 'your_secret_key';

// const verifyUser = (req, res, next)=>{
//   const token =  req.cookies.token;
//   if(!token){
//       return res.json({Message: 'please provide a token'})
//   }
//   else{
//       JWT.verify(token, JWT_SECRET, (err, decoded)=>{
//           if(err){
//                return res.json({Message: 'authentification error'})
//           }
//           else{
//               req.name = decoded.name;
//               req.id=decoded.id;
//               next();
//           }
// })
// }}

// const checkRole = (roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res.status(403).json({ Message: 'Forbidden' });
//   }
//   next();
// };

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('Token not provided');
    return res.status(401).json({ Message: 'Please provide a token' });
  }
  JWT.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Authentication error:', err);
      return res.status(403).json({ Message: 'Authentication error' });
    }
    req.user = decoded;
    console.log('Decoded JWT:', req.user); 
    next();
  });
};

const checkRole = (roles) => (req, res, next) => {
  console.log(roles);
  console.log(req.user.role)
  if (!roles.includes(req.user.role)) {
    console.log(`Access forbidden: ${req.user ? req.user.role : 'No user'}`);
    return res.status(403).json({ Message: 'Forbidden' });
  }
  next();
};

app.delete('/deleteOwner/:id', verifyUser, checkRole(['admin']), async (req, res) => {
  const id = req.params.id;
  console.log(`Attempting to delete owner with id: ${id}`); // Debugging line
  try {
    const result = await pool.query('DELETE FROM Owner WHERE id = $1', [id]);
    res.status(200).json({ message: 'Owner deleted successfully' });
  } catch (error) {
    console.error('Error deleting owner:', error);
    res.status(500).json({ error: 'Failed to delete owner' });
  }
});

app.delete('/delete/:id',verifyUser,checkRole(['admin','manager']), async (req, res) => {
  const id = req.params.id;
  const role=req.user.role;
  const userId=req.user.id;

  try {
    if (role === 'manager') {
      const { rows } = await pool.query('SELECT owner_id FROM TodoList WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const owner_id = rows[0].owner_id;
      if (owner_id !== userId) {
        return res.status(403).json({ error: 'You can only delete your own tasks' });
      }
    }

    const result = await pool.query('DELETE FROM TodoList WHERE id = $1', [id]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});



app.put('/updateOwner/:id',verifyUser,checkRole(['admin']), async (req, res) => {
  const id = req.params.id;
  const updatedOwnerName = req.body.name;
  try {
      const result = await pool.query('UPDATE Owner SET name = $1 WHERE id = $2 RETURNING *', [updatedOwnerName, id]);

  } catch (error) {
      console.error('Error updating owner:', error);
      res.status(500).json({ error: 'Failed to update owner' });
  }
});

app.put('/update/:id',verifyUser,checkRole(['admin','manager']), async (req, res) => {
  const id = req.params.id;
  const updatedTaskName = req.body.taskName;
  const role=req.user.role;
  const userId=req.user.id;

  try {
    if (role === 'manager') {
      const { rows } = await pool.query('SELECT owner_id FROM TodoList WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const owner_id = rows[0].owner_id;
      if (owner_id !== userId) {
        return res.status(403).json({ error: 'You can only update your own tasks' });
      }
    }
    const result = await pool.query('UPDATE TodoList SET taskName = $1 WHERE id = $2 RETURNING *', [updatedTaskName, id]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.get('/', verifyUser, (req, res)=>{
  return res.json({Status: 'Success', username: req.username});
})

app.post('/add',verifyUser, checkRole(['manager','admin']),async (req, res) => {
  const { taskname } = req.body;

  const completed = false;
  const owner_id = req.user.id;
  console.log(owner_id); 
  try {
    const result = await pool.query('INSERT INTO TodoList (taskname, completed, owner_id) VALUES ($1, $2, $3) RETURNING *', [taskname, completed, owner_id]);
    res.status(201).json(result); 
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

app.post('/addOwner',verifyUser,checkRole(['admin']), async (req, res) => {
  const { name } = req.body;


  const age = Math.floor(Math.random() * (40 - 15 + 1)) + 15; 
  try {
    const result = await pool.query('INSERT INTO Owner (name,age) VALUES ($1, $2) RETURNING *', [name,age]);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add owner' });
  }
});


app.post('/addOwnerUser', async (req, res) => {
  const user  = req.body; 
  const age=23;
  const role='user';
  try {
    const result = await pool.query('INSERT INTO Owner (name,age,password,role) VALUES ($1, $2,$3,$4) RETURNING *', [user.name,age,user.password,role]);
    res.status(201).json(result); 
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add owner' });
  }
});

app.get('/tasks',verifyUser,checkRole(['admin','user','manager']),async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM TodoList');
    res.send(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/userTasks', verifyUser, checkRole(['manager']), async (req, res) => {
  try {
    const owner_id = req.user.id;
    console.log("Owner ID:", owner_id); 
    const { rows } = await pool.query('SELECT * FROM TodoList WHERE owner_id = $1', [owner_id]);
    console.log("User Tasks:", rows); 
    res.send(rows);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
      const { name, password} = req.body;
      console.log(name);
      console.log(password);
      const client = await pool.connect();
      const query = 'SELECT * FROM Owner WHERE password = $1 and name=$2 ';
      const values = [password,name];
      const result = await client.query(query, values);
      
      if (result.rows.length > 0) {
          const iD=result.rows[0].id;
          const rol=result.rows[0].role;
          const token = JWT.sign({ name: name,id:iD,role:rol}, JWT_SECRET, { expiresIn: '1h' });
          res.cookie('token', token);
          res.status(200).json({Status: 'Success'});
      } else {
          res.json({ Message: 'Invalid username or password' });
      }
      
      client.release();
      
  } catch (err) {
      console.error('Error at login:', err); 
      res.status(500).json({ Message: 'Internal server error' });
}
});


module.exports = app;
