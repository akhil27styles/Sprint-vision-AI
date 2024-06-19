// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3000;
// app.use(cors());
// app.use(bodyParser.json());

// app.post('/api/tasks', (req, res) => {
//   const task = req.body;
//   const tasksFilePath = path.join(__dirname, 'tasks.json');

//   fs.readFile(tasksFilePath, (err, data) => {
//     if (err && err.code !== 'ENOENT') {
//       console.error('Error reading tasks file:', err);
//       return res.status(500).send('Internal server error');
//     }

//     const tasks = data && data.length ? JSON.parse(data) : [];
//     tasks.push(task);

//     fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing to tasks file:', err);
//         return res.status(500).send('Internal server error');
//       }

//       res.status(200).send('Task saved successfully');
//     });
//   });
// });

// app.get('/api/tasks', (req, res) => {
//   const tasksFilePath = path.join(__dirname, 'tasks.json');

//   fs.readFile(tasksFilePath, (err, data) => {
//     if (err) {
//       console.error('Error reading tasks file:', err);
//       return res.status(500).send('Internal server error');
//     }

//     const tasks = data && data.length ? JSON.parse(data) : [];
//     res.status(200).json(tasks);
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
