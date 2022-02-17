const express = require("express");

const controllers = require("../controllers/todo-controllers");

const router = express.Router();

router.get("/all", controllers.getAllTodos);

router.get("/all/sorted", controllers.getSortedTodos);

router.get("/ny", controllers.getNewTodo);

router.post("/ny", controllers.postTodo);

router.get("/:id", controllers.getSingleTodo);

router.get("/finished", controllers.getDoneTodo);

router.get("/unfinished", controllers.getUndoneTodo);

// router.get("/delete/:id", controllers.getDeleteTodo);

router.post("/delete/:id", controllers.postDeleteTodo);

router.get("/update/:id", controllers.getUpdateTodo);

router.post("/update/:id", controllers.postUpdateTodo);

module.exports = router;
