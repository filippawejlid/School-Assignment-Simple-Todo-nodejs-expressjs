const { ObjectId, Db } = require("mongodb");
const { getTodosCollection, getTodosList } = require("../database");
const Todos = require("../models/Todos");
const validateTodo = require("../utils");

exports.getStartingPage = (req, res, next) => {
  res.render("home");
};

exports.getAllTodos = async (req, res, next) => {
  const todoList = await getTodosList();

  if (todoList.length <= 0) {
    res.render("all-todos", { empty: "Hmm här var det tomt..." });
  } else {
    res.render("all-todos", { todoList });
  }
};

exports.getSortedTodos = async (req, res, next) => {
  const todoList = await getTodosList();

  if (todoList.length <= 0) {
    res.render("all-todos-sorted", { empty: "Hmm här var det tomt..." });
  } else {
    let x, y;

    let sorting = todoList.slice().sort(function (a, b) {
      x = a.Created;
      y = b.Created;
      if (x > y) {
        return -1;
      }
      if (x < y) {
        return 1;
      }

      return 0;
    });

    res.render("all-todos-sorted", { sorting });
  }
};

exports.getNewTodo = (req, res, next) => {
  res.render("todo-create");
};

exports.postTodo = async (req, res, next) => {
  var today = new Date();

  var date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    "." +
    today.getMinutes();

  const todo = new Todos(date, req.body.Description, false);

  if (validateTodo(todo)) {
    const todos = await getTodosCollection();

    await todos.insertOne(todo);

    res.redirect("/todos/all");
  } else {
    res.render("todo-create", {
      error: "Fel på inmatad data",
      Description: todo.Description,
    });
  }
};

exports.getSingleTodo = async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }

  if (id) {
    const todosCollection = await getTodosCollection();
    todosCollection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("todo-single", todo);
      } else {
        next();
      }
    });
  }
};

exports.getDoneTodo = async (req, res, next) => {
  const doneList = [];
  const todoList = await getTodosList();

  if (todoList.length <= 0) {
    res.render("done-todos", { empty: "Hmm här var det tomt..." });
  } else {
    for (const item of todoList) {
      if (item.Done == true) {
        doneList.push(item);
      }
    }

    res.render("done-todos", { doneList });
  }
};

exports.getUndoneTodo = async (req, res, next) => {
  const undoneList = [];
  const todoList = await getTodosList();

  if (todoList.length <= 0) {
    res.render("undone-todos", { empty: "Hmm här var det tomt..." });
  } else {
    for (const item of todoList) {
      if (item.Done == false) {
        undoneList.push(item);
      }
    }

    res.render("undone-todos", { undoneList });
  }
};

exports.getDeleteTodo = async (req, res, next) => {
  const id = ObjectId(req.params.id);

  const todos = await getTodosCollection();

  res.render("todo-delete", t);
};

exports.postDeleteTodo = async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }

  if (id) {
    const todosCollection = await getTodosCollection();
    await todosCollection.deleteOne({ _id: id });
    res.redirect("/todos/all");
  }
};

exports.getUpdateTodo = async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }

  if (id) {
    const todosCollection = await getTodosCollection();
    todosCollection.findOne({ _id: id }, (err, todo) => {
      if (todo) {
        res.render("todo-update", todo);
      } else {
        next();
      }
    });
  }
};

exports.postUpdateTodo = async (req, res, next) => {
  let id = undefined;
  try {
    id = ObjectId(req.params.id);
  } catch {
    next();
  }

  let done = false;
  if (req.body.Done === "Ja") {
    done = true;
  }

  if (id) {
    const todo = {
      Description: req.body.Description,
      Done: done,
    };

    if (validateTodo(todo)) {
      const collection = await getTodosCollection();
      const result = await collection.updateOne({ _id: id }, { $set: todo });
      res.redirect(`/todos/${id}/`);
    } else {
      res.render("todos/todos-edit", {
        error: "Fel på inmatad data",
        _id: id,
        Description: todo.Description,
      });
    }
  }
};
