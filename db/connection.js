const mongoose = require('mongoose')

module.exports = (url) => {
mongoose.connect(url,{
    family: 4 // Use IPv4, skip trying IPv6
})
.then(console.log("connection success!!"))
.catch((err)=>console.log(err));
}