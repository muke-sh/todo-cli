const { MongoClient, ObjectId } = require('mongodb')

let connectionString = `mongodb://localhost:27017/todos`


flag = process.argv[2]
value = process.argv[3]

const addFlag = "--add"
const doneFlag = "--done"
const removeFlag = "--remove"
const getFlag = "--get"

switch (flag) {
  case addFlag:
    handleAdd(value)
    break;
  case doneFlag:
    handleDone(value)
    break;
  case removeFlag:
    handleRemove(value)
    break;
  case getFlag:
    handleGet(value)
    break;

  default:
    break;
}


async function handleAdd(flagValue) {

  const client = new MongoClient(connectionString)
  try {
    await client.connect()
    console.log("adding todo", flagValue)

    const tasks = client.db().collection("tasks")
    const task = {
      taskName: flagValue,
      status: "in-progress"
    }
    const res = await tasks.insertOne(task)
    console.log(res.insertedId)
  } catch (err) {
    console.log("error while creating task", err)
  } finally {
    client.close()
  }

}

async function handleDone(id) {
  const client = new MongoClient(connectionString)
  const query = { _id: ObjectId.createFromHexString(id) }

  try {
    await client.connect()

    const tasks = client.db().collection("tasks")
    const updateStatus = {
      $set: {
        status: "completed"
      }
    }
    const task = await tasks.findOneAndUpdate(query, updateStatus)
    console.log(task)

  } catch (err) {
    console.log("error while updating task", err)
  } finally {
    client.close()
  }
  console.log("done todo", id)
}

async function handleRemove(id) {

  console.log("remove todo", id)
  const client = new MongoClient(connectionString)
  const query = { _id: ObjectId.createFromHexString(id) }
  try {
    await client.connect()

    const tasks = client.db().collection("tasks")
    const res = await tasks.deleteOne(query)

    console.log(res.deletedCount)
  } catch (err) {
    console.log("error while creating task", err)
  } finally {
    client.close()
  }
}

async function handleGet(id) {

  if (!id) {
    console.log("get all todos")
    findAll()
    return
  }

  findOneTodo(id)
}


async function findAll() {
  const client = new MongoClient(connectionString)
  const query = {}
  try {
    await client.connect()

    const tasks = client.db().collection("tasks")
    const cursor = tasks.find(query)

    if (await cursor.count() === 0) {
      console.log("no todos found")
    }
    await cursor.forEach(console.dir);
  } catch (err) {
    console.log("error while creating task", err)
  } finally {
    client.close()
  }

}

async function findOneTodo(id) {
  const client = new MongoClient(connectionString)
  const query = { _id: ObjectId.createFromHexString(id) }
  try {
    await client.connect()

    const tasks = client.db().collection("tasks")
    const task = await tasks.findOne(query)
    console.log(task)

  } catch (err) {
    console.log("error while creating task", err)
  } finally {
    client.close()
  }

}

