const express = require("express");
const bodyParser = require("body-parser");
const z = require("zod");
const { JWT_SECRET, SALTROUNDS } = require("../config");
const { User, Account } = require("../db.js");
const { authMiddleware } = require("../middleware.js");
const bcrypt = require("bcrypt");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");

const UserSignup = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});

const UserLogin = z.object({
    username: z.string().email(),
    password: z.string(),
});

userRoute.post("/signup", async (req, res) => {
    //Making sure input is of the right format
    const { success } = UserSignup.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        });
    }

    //Validating username doesnt exist
    const userExists = await User.findOne({
        username: req.body.username,
    });
    if (userExists) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        });
    }

    // Generating the password hash
    const passwordhash = await bcrypt.hash(req.body.password, SALTROUNDS);
    const user = await User.create({
        username: req.body.username,
        password: passwordhash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign(
        {
            userId,
        },
        JWT_SECRET
    );

    res.json({
        message: "User created successfully",
        token: token,
    });
});

userRoute.post("/login", async (req, res) => {
    // Adding zod validation
    const { success } = UserLogin.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid Entry",
        });
    }

    // finding user in database
    const user = await User.findOne({
        username: req.body.username,
    });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (user && result === true) {
        const token = jwt.sign(
            {
                userId: user._id,
            },
            JWT_SECRET
        );

        res.json({
            token: token,
        });
        return;
    }

    res.status(411).json({
        message: "Invalid Password or Email",
    });
});

const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});

userRoute.get("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information",
        });
    }
    await User.updateOne(
        {
            _id: req.userId,
        },
        req.body
    );

    res.json({
        message: "Updated successfully",
    });
});

userRoute.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {
                firstName: {
                    $regex: filter,
                },
            },
            {
                lastName: {
                    $regex: filter,
                },
            },
        ],
    });

    res.json({
        user: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
});
module.exports = userRoute;
