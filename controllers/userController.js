import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config()

export function createUser(req, res) {
    const newUserData = req.body

    if(newUserData.type == "admin"){
        if(req.user==null){
            res.json({
                message : "Please login as administrator to create admin accounts"
            })
            return
        }

        if(req.user.type != "admin"){
            res.json({
                message : "Please login as administrator to create admin accounts"
            })
            return
        }
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10)

    const user = new User(newUserData)
    user.save().then(() => {
        res.json({
            message: "User created"
        })
    }).catch(() => {
        res.json({
            message: "User not created"
        })
    })
}

export function loginUser(req, res) {
    User.find({ email: req.body.email }).then(
        (users) => {
            if (users.length == 0) {
                res.json({
                    message: "User not found"
                })
            }else {
                const user = users[0]
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
                if(isPasswordCorrect){
                    const token = jwt.sign({
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        isBlocked : user.isBlocked,
                        type : user.type,
                        profilePicture : user.profilePicture
                    },process.env.SECRET)
                    
                    res.json({
                        message : "User logged in",
                        token : token,
                        user : {
                            firstName : user.firstName,
                            lastName : user.lastName,
                            email : user.email,
                            type : user.type,
                            profilePicture : user.profilePicture
                        }
                    })
                }else{
                    res.json({
                        message : "User not logged in (wrong password)"
                    })
                }
            }
        }
    )
}

export function isAdmin(req){
    if(req.user==null){
        return false
    }
    if(req.user.type != "admin"){
        return false
    }
    return true
}

export function isCustomer(req){
    if(req.user==null){
        return false
    }
    if(req.user.type != "customer"){
        return false
    }
    return true
}

export async function googleLogin(req, res) {
    const token = req.body.token;

    try {
        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const email = response.data.email;

        // check if user exists
        let user = await User.findOne({ email });

        if (user) {
            const jwtToken = jwt.sign({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isBlocked: user.isBlocked,
                type: user.type,
                profilePicture: user.profilePicture
            }, process.env.SECRET);

            return res.json({
                message: "User logged in",
                token: jwtToken,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    type: user.type,
                    profilePicture: user.profilePicture
                }
            });
        }

        // create new user
        user = new User({
            email,
            firstName: response.data.given_name,
            lastName: response.data.family_name,
            type: "customer",
            password: "ffffff",
            profilePicture: response.data.picture
        });

        await user.save();

        res.json({
            message: "User created",
            user
        });

    } catch (e) {
        console.log(e.response?.data || e.message);
        res.status(500).json({
            message: "Google login failed",
            error: e.message
        });
    }
}

export async function getUser(req,res){
    if(req.user==null){
        res.status(404).json({
            message : "Please login"
        })
        return
    }
    res.json(req.user)
}