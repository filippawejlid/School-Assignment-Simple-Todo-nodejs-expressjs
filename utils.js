function validateTodo(todo) {
  let valid = true;

  //Boolsk algebra
  //OM valid är true kollar den om todo.Description är satt, om inte blir valid false
  valid = valid && todo.Description;

  valid = valid && todo.Description.length > 0;

  valid = valid && isNaN(todo.Description);

  return valid;
}

module.exports = validateTodo;
