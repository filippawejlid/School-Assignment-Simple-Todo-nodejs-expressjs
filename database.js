const { MongoClient } = require("mongodb");

async function getDb() {
  const client = new MongoClient("mongodb://localhost");
  //   const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  await client.connect();

  const db = client.db("Assignment2-Filippa");

  return db;
}

async function getTodosCollection() {
  const db = await getDb();

  const todos = await db.collection("todos");

  return todos;
}

async function getTodosList() {
  const db = await getDb();

  const todos = await db.collection("todos").find().toArray();

  return todos;
}

async function getTodoCount() {
  const collection = await getTodosCollection();
  const count = await collection.countDocuments();
  return count;
}

module.exports = {
  getTodosCollection,
  getTodosList,
  getTodoCount,
};
