const express = require('express')
const bodyParser = require('body-parser')
const z = require('zod')
const { JWT_SECRET } = require('../config')
const { User } = require('../db.js')
const { authMiddleware } = require('../middleware.js')

const userRoute = express.Router()

const UserSignup = z.object({
  username: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string()
});

const UserLogin = z.object({
    username: z.string().email(),
    password: z.string()
})

userRoute.post('/signup', async (req, res) => {

    //Making sure input is of the right format
    const { success } = UserSignup.safeParse(req.body())    
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    //Validating username doesnt exist 
    const userExists = await User.findOne({
        username: req.body.username
    }) 
    if(userExists){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    //Creating a user in database
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

userRoute.post('/login', async (req, res) => {
    
    // Adding zod validation
    const { success } = UserLogin.safeParse(req.body())    
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    // finding user in database
    const user = await User.findOne({
        username: req.body.username
    }) 

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

userRoute.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

userRoute.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
export default userRoute;