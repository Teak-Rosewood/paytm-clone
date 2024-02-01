const express = require("express");
const userRouter = require("./user");
const accountsRouter = require("./account");

const router = express.Router();

router.use("/user", userRouter);

router.use("/account", accountsRouter);

module.exports = router;
