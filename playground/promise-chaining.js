require('../src/db/mongoose')
const NewUsers = require('../src/models/users')
NewUsers.findByIdAndUpdate('64138d6372b92305d2be0248', {
    age: 1
}).then((user) => {
    console.log(user)
    return NewUsers.countDocuments({ age: 1 }).then(result => {
        console.log(result)
    })

}).catch(er => console.log(er))



























// const add = (a, b) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(a + b)
//         }, 3000)
//     })
// }
// add(3, 5).then((sum) => {
//     console.log(sum)


// })

// .catch((e) => {
//     console.log(e)
// })
// add(3, 0).then((sum) => {
//     console.log(sum)


// })

// .catch((e) => {
//     console.log(e)
// })