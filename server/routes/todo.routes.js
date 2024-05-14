const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controllers.js');

// Define routes
router.get('/get', todoController.getAllTodos);
router.post('/create', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
