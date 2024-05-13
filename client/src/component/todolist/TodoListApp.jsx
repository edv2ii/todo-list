import React, { useState, useEffect } from "react";

import "./todolistapp.css";

function TodoListApp() {
  const [todos, setTodos] = useState([]);
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:5050/todos/get");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  console.log(todos)

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const newTodo = {
          text: inputValue,
          completed: false,
          color:
            colors[
              customColorSequence[(todos.length+finishedTodos.length) % customColorSequence.length]
            ],
        };
        const response = await fetch("http://localhost:5050/todos/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });
        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
        await fetchTodos();
        setInputValue("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const removeTodo = async (indexToRemove) => {
    setTodos(todos.filter((todo, index) => index !== indexToRemove));
    try {
      const response = await fetch(`http://localhost:5050/todos/${todos[indexToRemove]._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error("Failed to deleted todo");
      }
    } catch (error) {
      console.error("Error deleted todo:", error);
    }
  };

  const toggleComplete = (indexToToggle) => {
    const updatedTodos = todos.map((todo, index) =>
      index === indexToToggle ? { ...todo, completed: !todo.completed } : todo

    );


    const updatedTodo = updatedTodos[indexToToggle];
    if (updatedTodo.completed) {
      setFinishedTodos([...finishedTodos, updatedTodo]);
      setTodos(updatedTodos.filter((todo, index) => index !== indexToToggle));
    } else {
      setTodos(updatedTodos);
      setFinishedTodos(
        finishedTodos.filter((todo, index) => index !== indexToToggle)
      );
    }
  };

  const editTodo = (indexToEdit) => {
    setEditIndex(indexToEdit);
    setEditValue(todos[indexToEdit].text);
    console.log(todos[indexToEdit], indexToEdit);
  };


  // Inside your component
const saveEdit = async (index) => {
  const updatedTodos = [...todos];
  updatedTodos[editIndex] = {
    ...updatedTodos[editIndex],
    text: editValue,
  };
  setTodos(updatedTodos);
  setEditIndex(null);
  setEditValue("");

  try {
    const response = await fetch(`http://localhost:5050/todos/${todos[editIndex]._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: editValue }),
    });
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

  const moveBackToTodo = (indexToMove) => {
    const updatedTodo = finishedTodos[indexToMove];
    updatedTodo.completed = false; // Set completed to false
    setTodos([updatedTodo, ...todos]); // Add the updatedTodo to the beginning of the todos array
    setFinishedTodos(
      finishedTodos.filter((todo, index) => index !== indexToMove)
    );
  };

  let colors = ["#C1C3F3", "#CBB7DA", "#ECC3D5", "#FFDDE4", "#FFEBE5"];

  const customColorSequence = [
    0,
    1,
    2,
    3,
    4, // first cycle
    3,
    2,
    1,
    0, // second cycle
    1,
    2,
    3,
    4, // third cycle
    // continue the pattern as needed
  ];

  const todoListWithColor = todos.map((todo, index) => ({
    ...todo,
    color: colors[customColorSequence[index % customColorSequence.length]],
  }));

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="add-task">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      {
        <ul className="todolist">
          {todos.map((todo, index) => (
            <li key={index} style={{ "--color": todo.color }}>
              <img
                id = "check"
                src={
                  todo.completed
                    ? "./src/icon/heart/heart2.png"
                    : "./src/icon/heart/heart2.png"
                }
                alt={todo.completed ? "Checked Icon" : "Unchecked Icon"}
                onClick={() => toggleComplete(index)}
              />
              <div className="content-btn">
                {editIndex === index ? (
                  <input
                    id="value"
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={(e) => saveEdit(index)}
                    autoFocus
                  />
                ) : (
                  <span
                    id="toggle-complete"
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                    onClick={() => toggleComplete(index)}
                  >
                    <p>{todo.text}</p>
                  </span>
                )}
                <div className="btn">
                  {editIndex !== index && (
                    <button id="edit" onClick={() => editTodo(index)}>
                      Edit
                    </button>
                  )}
                  <button id="remove" onClick={() => removeTodo(index)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      }
      {finishedTodos.length != 0 && todos.length != 0 ? 
      <hr style={{display: "flex", background: "0.5px solid rgba(113, 113, 113, 0.128);"}}></hr> : <hr style={{visibility: "hidden"}}></hr>}
      <ul className="finish-todo">
        {finishedTodos.map((todo, index) => (
          <li key={index} style={{ "--color": todo.color }}>
            <img
                id = "check"
                src={
                  todo.completed
                    ? "../../icon/heart/heart2.png"
                    : "../../icon/heart/heart1.png"
                }
                alt={todo.completed ? "Checked Icon" : "Unchecked Icon"}
                onClick={() => moveBackToTodo(index)}
              />
            <span
              id="toggle-complete"
              style={{ textDecoration: "line-through" }}
              onClick={() => moveBackToTodo(index)}
            >
              <p>{todo.text}</p>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoListApp;