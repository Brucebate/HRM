// const mongoose=require("mongoose")
// mongoose.connect("mongodb://localhost:27017/Priyanshu")
// .then(()=>{
//     console.log("mongodb connected")
// })
// .catch(()=>{
//     console.log('failed')
// })


// const newSchema = new mongoose.Schema({
//     email:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// })
// const collection = mongoose.model('collection')
// module.exports = collection



const mongoose = require("mongoose");
const { schema, model } = mongoose;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        
    },
    employeeId: {
        type: String,
        required:true,
        unique: true

    },
    role: {
        type: String,
        required: true,
        enum: ['employee', 'admin']  //Define allowed values for a role
    },
    mobile: {
        type: Number,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
