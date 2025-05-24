const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller');

router.post('/create', taskController.createTask);

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory buffer

// Your route, add multer middleware to handle single file 'file'
router.post('/upload/:id', upload.single('file'), taskController.uploadFile);


// Update a task by ID
router.put('/update/:id', taskController.updateTask);

// Delete a task by ID
router.delete('/delete/:id', taskController.deleteTask);

// View a task by ID
router.get('/view/:id', taskController.viewTask);



module.exports = router;
