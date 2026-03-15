import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Student from "./models/student.js";
import studentRouter from "./routes/studentRouter.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js"
import jwt, { decode } from "jsonwebtoken";

const app = express();

const mongoUrl = "mongodb+srv://Tharani:2004@cluster0.6wqfynb.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database Connected");
})
app.use(bodyParser.json())

app.use(
    (req, res, next) => {
        // console.log(req.header("Authorization"))

        const token = req.header("Authprization")?.replace("Bearer ", "")
        console.log(token)

        if (token != null) {
            jwt.verify(token, "cbc-secret-key-7973", (error,
                decoded) => {
                    if(!error){
                        console.log(decoded)
                        req.user = decoded
                    }
            })
        }
        next()
    }
)

app.use("/api/students", studentRouter)
app.use("/api/products", productRouter)
app.use("/api/users", userRouter)

// app.get("/",
//     (req,res) => {
//         console.log(req);
//         console.log(req.body)
//         console.log("This is a request");


//     // process

//     res.json({
//         message: "Good Morning " + req.body.name
//     })
//     }
// );

// app.post("/",
//     (req,res) => {

//        const newStudent = new Student(req.body)

//        newStudent.save().then(
//         ()=>{
//             res.json({
//                 message: "Student created"
//             })
//         }
//        )
//     }
// );

app.listen(
    3000,
    () => {
        console.log('Server is running on port 3000');
    }
)