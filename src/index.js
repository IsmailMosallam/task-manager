require('dotenv').config()
const express = require("express")
const app = express();
require('./db/mongoose')
const router = require('./router/user')
const task = require('./router/task');

app.use(express.json())
app.use(router)
app.use(task)


console.log(process.env.PORT)
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up on${port} `)
});
// const Task = require('./models/task')
// const NewUsers = require('./models/users')
// const main = async() => {
//         const user = await NewUsers.findById('641d93ffd42b391f888807d5')
//         await user.populate('tasks ').execPopulate()
//         console.log(user.tasks)

//     }
//     // main()