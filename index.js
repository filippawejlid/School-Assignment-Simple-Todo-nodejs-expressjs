const express = require("express");
const exphbs = require("express-handlebars");
const { getTodoCount } = require("./database");

const todoRoute = require("./routes/todoRoute");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: "hbs",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    "." +
    today.getMinutes();

  let count = await getTodoCount();

  res.render("home", { date, count });
});

app.use("/todos", todoRoute);

app.use("/", (req, res) => {
  res.status(404).render("not-found");
});

app.listen(5000, () => {
  console.log("http://localhost:5000");
});
