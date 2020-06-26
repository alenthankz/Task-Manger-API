require('./src/db/mongoose')
const User=require('./src/db/models/user')

// User.findByIdAndUpdate('5ef5e2656704810c1470edb0',{age:28}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:27})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAndCount =async (id,age)=>{
    await User.findByIdAndUpdate(id,{age:age})
    const count = User.countDocuments({age:age})
    return count
}

updateAndCount('5ef5e2656704810c1470edb0',29).then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e)
})